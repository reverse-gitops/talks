# The deck as a static site behind nginx, for hosting on a real domain under a path, e.g.
# https://demo.koudijs.dev/dcnd-2026/. Localhost (`npm run dev`) does not use this file.
#
# Build from the repository root, since the deck installs the web-terminal addon from ../tools:
#   docker build -f settings-that-break/Dockerfile --build-arg BASE_PATH=/dcnd-2026/ -t settings-that-break .
#   docker run --rm -p 8080:8080 settings-that-break   # then open http://localhost:8080/dcnd-2026/
#
# BASE_PATH is baked into the build: Slidev prefixes every asset with it, and nginx serves the deck
# there. The ingress must pass the path through unchanged (no prefix stripping).

FROM --platform=$BUILDPLATFORM node:24-slim AS build
ARG BASE_PATH=/dcnd-2026/
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN case "${BASE_PATH}" in /?*/) ;; *) echo "BASE_PATH must be a path like /dcnd-2026/ (leading and trailing slash), got '${BASE_PATH}'" >&2; exit 1 ;; esac

# Same order as `task install-node-deps`: the addon first, then the deck that links it.
WORKDIR /src/tools/slidev-addon-web-terminal
COPY tools/slidev-addon-web-terminal/package.json tools/slidev-addon-web-terminal/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY tools/slidev-addon-web-terminal/ ./

WORKDIR /src/settings-that-break
COPY settings-that-break/package.json settings-that-break/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY settings-that-break/ ./
RUN npx slidev build --base "${BASE_PATH}" --out /site \
 && sed "s#__BASE__#${BASE_PATH}#g" nginx.conf.template > /default.conf

# The site is the same on every architecture, so this stage only copies (no emulation needed).
FROM nginxinc/nginx-unprivileged:1.29-alpine
ARG BASE_PATH=/dcnd-2026/
COPY --from=build /default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site /usr/share/nginx/html${BASE_PATH}
EXPOSE 8080
