---
theme: default
addons:
  - web-terminal
---

# Web Terminal Addon Test

This slide tests the `WebTerminal` component.

Click this command to send it to the terminal:

<span class="clickable-code">
```bash
echo "Hello World"
```
</span>

The below will also be sent to the terminal if clicked:
<div class="clickable-code">echo hello</div>

<div class="h-40 w-full mt-4">
  <!-- Connects to the local docker container on port 10001 -->
  <!-- <WebTerminal backendUrl="/" /> -->
  <WebTerminal backendUrl="http://localhost:10001/" />
</div>

---

# Second Slide

Second Slide Content
