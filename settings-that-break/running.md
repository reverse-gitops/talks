Run these three: all in there own little nice terminal program

task dev-terminal-bridge
kubectl proxy --port 8001
cd settings-that-break && npm run dev
