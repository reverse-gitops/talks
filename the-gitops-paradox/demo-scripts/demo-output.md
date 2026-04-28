
*   0061da8 (HEAD -> main, origin/main, origin/HEAD) Merge branch 'nl-stuff'
|\
| * 0180046 [CREATE] kro.run/v1alpha1/podinfoapps/paal
| * fd749e6 [CREATE] kro.run/v1alpha1/podinfoapps/gevel
| * 00099d2 [CREATE] kro.run/v1alpha1/podinfoapps/fiets
|/
* 256fee3 [CREATE] examples.configbutler.ai/v1alpha1/quizsubmissions/demo-4jqc5
* 44298b3 [CREATE] v1/serviceaccounts/quiz-access
* e68def7 [CREATE] v1/serviceaccounts/default
* 38383fb [CREATE] v1/serviceaccounts/auth-service
* 23d7941 [CREATE] v1/secrets/auth-session-cookie-keys
* bdabf5c reconcile: sync 47 resources
* 5001415 [CREATE] configbutler.ai/v1alpha1/clusterwatchrules/demo-cluster-resources-demo
* 344438b [CREATE] configbutler.ai/v1alpha1/watchrules/demo-watch-all-demo
* edef143 [UPDATE] configbutler.ai/v1alpha1/gittargets/demo-target-demo
* 6abb441 [UPDATE] configbutler.ai/v1alpha1/gitproviders/demo-provider-demo

```bash 
demo  main  ❯ kubectl get podinfoapps -A
NAMESPACE             NAME    URL
podinfos-intent       fiets   
podinfos-intent       gevel   
podinfos-preview      fiets   https://demo.configbutler.ai/podinfos-preview/fiets/
podinfos-preview      gevel   https://demo.configbutler.ai/podinfos-preview/gevel/
podinfos-production   fiets   https://demo.configbutler.ai/podinfos/fiets/
podinfos-production   gevel   https://demo.configbutler.ai/podinfos/gevel/
```