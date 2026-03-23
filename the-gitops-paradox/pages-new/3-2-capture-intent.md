---
layout: image-right
image: /images/train.jpg

transition: fade

---

# 2. Capture Intent, Not Implementation

* This is not API-only
* Keep resources declarative and reversible
* Store clean intent, not generated implementation details
* Think CRDs, Crossplane, KRO, and similar patterns

<!--
This only works if the resources stay clean and reversible.<br/>
If you put generated implementation details or one-way transformations in the middle,<br/>
you lose the ability to move smoothly between API and Git.<br/>
So this is API first, not API only.<br/>
Git still matters, but the resources need to express intent clearly.
-->

---
layout: center

transition: fade

---

# KRO as example

```yaml
apiVersion: kro.run/v1alpha1
kind: PodInfoApp
metadata:
  name: fiets
  namespace: podinfos-intent
spec:
  replicas: 1
  message: The Dutch word for bicycle is "fiets". We have a lot of them. 🚲
  color: "#115711"
  logoURL: https://demo.configbutler.ai/podinfo-assets/podinfos-fiets.jpg
```

<!--
This is why I like KRO as an example.<br/>
It gives you the abstraction people often want from Helm,<br/>
but in a more cloud-native shape:<br/>
a typed resource, with a real schema, living inside the Kubernetes API.<br/>
This is the kind of intent I want humans and AI to write.
-->
