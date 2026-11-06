Run these three: all in there own little nice terminal program

task dev-terminal-bridge
kubectl proxy --port 8001
cd ordev/abusing-kubernetes-api && npm run dev

Once before the talk, for the live token slide (pages/api-key.md):

kubectl apply -f pages/demo-scripts/seat-reader.yaml
kubectl config view --raw --minify -o jsonpath='{.clusters[0].cluster.certificate-authority-data}' | base64 -d > ~/.kube/koudijs-ca.crt
