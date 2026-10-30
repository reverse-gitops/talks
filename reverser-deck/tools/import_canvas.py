"""One-off importer: converts the Design-canvas artboards (*.dc.html) into deck slides.

Usage: python3 tools/import_canvas.py <folder with *.dc.html>

For each artboard it writes src/slides/<id>/slide.html (markup only), slide.css (the
slide's own keyframes) and index.js (timing, step labels and slide-specific hooks).
Shared things (engine, timeline, controls, base styles) live in src/ and are not touched.
"""
import json, re, sys, os

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'slides')
ORDER = [
    ('Problem', 'problem'), ('BigPicture', 'big-picture'), ('Modeling', 'modeling'),
    ('InsideKCP', 'inside-kcp'), ('Main', 'two-streams'), ('CommitRequest', 'commit-request'),
    ('Delivery', 'delivery'),
]
BASE_RULES = ('body{', 'a{', '.an{', '.lin{', '.scrub', '.playbtn')

def method_block(js, name):
    """Return the source of a class method `name(...) { ... }` (brace-matched)."""
    m = re.search(r'\n  (?:get )?%s\([^)]*\) \{' % name, js)
    if not m: return None
    i = js.index('{', m.start()); depth = 0
    for j in range(i, len(js)):
        depth += js[j] == '{'; depth -= js[j] == '}'
        if depth == 0: return js[m.start() + 1:j + 1]

for artboard, sid in ORDER:
    s = open(os.path.join(SRC, artboard + '.dc.html')).read()
    title = re.search(r'<title>(.*?)</title>', s).group(1)
    style = re.search(r'<helmet>.*?<style>\n(.*?)</style>', s, re.S).group(1)
    css = '\n'.join(l for l in style.splitlines() if l and not l.startswith(BASE_RULES)) + '\n'
    body = s[s.index('</helmet>') + len('</helmet>'):s.index('</x-dc>')].strip() + '\n'
    script = s[s.index('class Component extends DCLogic {'):s.index('// SLIDE ENGINE')]

    # controls are rendered by the shared Controls part
    nxt = re.search(r'<a class="playbtn" data-next="1"[^>]*>([^<]*)</a>\n?', body)
    next_label = nxt.group(1) if nxt else None
    if nxt: body = body.replace(nxt.group(0), '')
    body = re.sub(r'<a data-prev="1"[^>]*>[^<]*</a>\n?', '', body)
    body = re.sub(r'<button class="playbtn".*?</button>\n?', '', body, flags=re.S)
    # timeline mount point
    body = re.sub(r'<div (style="[^"]*")><dc-import name="Timeline"[^>]*></dc-import></div>',
                  r'<div data-part="timeline" \1></div>', body)
    body = body.replace('<!-- shared part: Timeline.dc.html -->', '<!-- shared part: src/parts/timeline.js -->')
    # root element: behaviour is attached by the engine
    body = re.sub(r' ref="\{\{setRoot\}\}"| onMouseEnter="\{\{onEnter\}\}"| tabIndex="0"| onKeyDown="\{\{onKey\}\}"'
                  r'| onClick="\{\{onStage\}\}"| onContextMenu="\{\{onStageBack\}\}"| onAnimationEnd="\{\{onEnd\}\}"', '', body)
    body = body.replace('; --T: {{loopDur}}; --tick: {{tickDur}}', '').replace('; --T: {{loopDur}}', '')
    body = body.replace('outline: none; ', '')
    body = re.sub(r'<span( style="[^"]*")>\{\{failCount\}\}</span>', r'<span data-bind="failCount"\1></span>', body)
    left = re.findall(r'\{\{[^}]*\}\}', body)
    assert not left, (artboard, left)

    seconds = int(re.search(r'get seconds\(\) \{ return (\d+); \}', script).group(1))
    marks = re.search(r'get marks\(\) \{\n    return (\[.*?\]);', script, re.S).group(1)
    hooks = [method_block(script, h) for h in ('extraState', 'slideVals', 'onFrame')]
    hooks = [h for h in hooks if h]
    hooks = [h.replace('slideVals() {', 'vals() {') for h in hooks]
    # CSS custom properties that used to be template holes on the root element
    hooks = [h.replace("slideVals(s) { return { tickDur: (s / 30) + 's' }; }",
                       "// CSS variables set on the slide root (the 1s audit-batch pulse scales with the slide).\n  vars(s) { return { '--tick': (s / 30) + 's' }; }") for h in hooks]
    comments = re.findall(r'\n  (// (?!──).*)\n  onFrame', script)

    d = os.path.join(OUT, sid); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'slide.html'), 'w').write(body)
    open(os.path.join(d, 'slide.css'), 'w').write(css)
    js = ["import html from './slide.html?raw';", "import css from './slide.css?inline';", '',
          'export default {',
          f"  id: {json.dumps(sid)},",
          f"  title: {json.dumps(title)},",
          f"  seconds: {seconds},",
          f"  next: {json.dumps(next_label)},",
          '  html,', '  css,',
          '  // Labels under the timeline; `at` is a fraction of the slide timeline.',
          f"  marks: {marks.replace(chr(10) + '    ', chr(10) + '  ')},"]
    for h in hooks:
        if h.lstrip().startswith('onFrame') and comments: js.append('  ' + comments[0])
        js.append(h + ',')
    js[-1] = js[-1].rstrip(',')
    js.append('};')
    open(os.path.join(d, 'index.js'), 'w').write('\n'.join(js) + '\n')
    print(sid, seconds, next_label, len(body), 'bytes')
