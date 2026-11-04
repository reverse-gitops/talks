# The Evolution of GitOps in Platform Engineering: raw transcript

Artem Lajko and Koray Oksay, Cloud Native Summit Munich 2026. Auto-generated, with timestamps. Summary: [evolution-of-gitops-lajko-oksay.md](evolution-of-gitops-lajko-oksay.md).

https://www.youtube.com/watch?v=Ko2IIWk5RPE

Chapter 1: Introduction and context
0:011 second[music]
0:066 secondsWe can start. Hello together. Hello.
0:1010 secondsThank you for joining our talk. We will presenting you today the evolution of GitHubs in platform engineering. We try to put nine years of evolution together
0:1919 secondsin just 30 minutes. Let's see if we can make it possible. So, but but before we start, short to me. My name is Atam Leo.
0:2727 secondsI'm working as head of platform engineering uh for ATS consulting CNCF certified cubestone out ambassador for platform.org talk and published
0:3434 secondsco-author of the book implementing gith of the cubinators but I'm not alone here obviously I have k with me kai can you introduce yourself please
0:4141 secondsuh hello everyone my name is kai I work for kubmatic as a consultant and my daily job is working on cloud native and
0:4848 secondskubernetes related stuff and I also do some community work um as an ambassador for CNCF and platform engineering as
0:5656 secondswell as organizing um devops as sul or some some some other meetups Um so today's mission is to understand I
1:051 minute, 5 secondsmean we want to understand what's coming and to do that we need to understand what happened so far and uh there will
Chapter 2: Evolution of infrastructure
1:141 minute, 14 secondsbe some terminology that we need to align. So the first one is declarative uh where we say uh it's about describing
1:231 minute, 23 secondsthe desired state not the steps to get there. Uh the second one is catalog. Uh
1:291 minute, 29 secondsit's a created set of applications to be used on your platform. And push push
1:361 minute, 36 secondsversus pull uh which is about who is initiating the change. Is it initiated
1:441 minute, 44 secondsor is it a push from your CI uh pipeline towards the cluster or is it pulled from
1:521 minute, 52 secondsthe clust by the cluster or by an agent uh to your uh from the source like git
2:002 minutesor somewhere else to your cluster as well. Uh so how it all began it began by uh Alexis Richardson at the time he was
2:082 minutes, 8 secondsworking at Viworks and uh he just I mean he and other people were doing some
2:162 minutes, 16 secondspractices uh about deploying stuff or um the other things and uh he simply
2:232 minutes, 23 secondscreated a some principles around uh what they've been doing and he called this githops. Uh but what the problem was
2:322 minutes, 32 secondsthere at the time? Uh so since 2000s the whole uh enterprise HA uh setups were
2:392 minutes, 39 secondslike yeah you had to load balancer some web servers and then maybe some applications at the behind. Um well it
2:462 minutes, 46 secondswas good but you had to have some primary secondary databases or um you need to create VMs manually. that there
2:552 minutes, 55 secondswas lots of uh manual work uh like you need to jump to from host to host edit some HTTP conf files save them restart
3:033 minutes, 3 secondsthe service go to the next one there could be drifts you may you might have some uh typos and other stuff and that
3:113 minutes, 11 secondsdidn't scale well uh it was working fine but uh in terms of scale it wasn't uh very good um and what we did we we just
3:213 minutes, 21 secondsstarted to write things down right so first uh the configuration management tools uh popped in like um anible puppet
3:283 minutes, 28 secondschef uh and then uh we said like yeah we can also do this to to our infrastructure like creating
3:353 minutes, 35 secondsVMs or load balances and everything uh then terraform was in the uh in the picture now nowadays open to or we we
3:443 minutes, 44 secondslike open to now then this lets everything to be as code so now nowadays you can have the infra
3:513 minutes, 51 secondscode network as code policy as code. So everything becomes more and more declarative.
3:583 minutes, 58 secondsUm so we got the new tooling uh but the uh had the same m mindset or same
4:044 minutes, 4 secondschallenge. Uh so uh an engineer would uh just have the anible playbook on his local and then applying it to servers.
4:144 minutes, 14 secondsUh but then this person was initiating it on on his local or her local and someone else doing it as well. So the
4:214 minutes, 21 secondsthe change was initiated or pushed to to the related or target service. Yeah. And
4:294 minutes, 29 secondsthen we we got um smart and we said that okay maybe we can use uh CI or some some other service to do that automatically.
4:374 minutes, 37 secondsSo automated things uh we have the pipe ops now where we put everything to CI and then it was pushing it to the
4:444 minutes, 44 secondsserver. Same thing but the the uh initiator changed. Um but the mindset was the same.
Chapter 3: GitOps principles
4:534 minutes, 53 secondsUm and then we came to the agents with with GitHubs. This agent is not the AI agent that we are talking nowadays. It's
5:015 minutes, 1 secondmore like Argo CD or or the other or flux and everything. um where the user
5:075 minutes, 7 secondsputs the declarations in in the Git repo and agent running on the target host was
5:145 minutes, 14 secondspulling those to apply on this platform or host or cluster where where we pull
5:205 minutes, 20 secondsit and the agent is also responsible to to keep the environment in sync. So you don't make manual changes on the system.
5:295 minutes, 29 secondsYou just change things on the git repo um or just you put the contract there, you put there uh what you desire to have
5:385 minutes, 38 secondsum your intent and the agent watches uh every change and pulls it uh in a loop all the time. So there was no real event
5:465 minutes, 46 secondsto trigger it. The the only event was to uh change the contract.
5:525 minutes, 52 secondsSo the basic principles uh for GitHubs is that we have four core principles. Um it's easy. So it has to be declarative.
6:006 minutesYou need to put what you want to your your desired state uh there. It needs to be versioned and this version needs to
6:076 minutes, 7 secondsbe immutable. So no one else um changes it. This version if there will be new change it means a new version. Uh it's
6:166 minutes, 16 secondssupposed to be pool based. So something needs to get those changes to to that environment. You should not or like from
6:246 minutes, 24 secondslocal or from CI should not be pushed but it should be pulled uh by the target environment itself. And this must be
6:326 minutes, 32 secondsdoing continuously in a in a loop all the time checking if do do you have any changes? Yes. Okay, I'll apply them. Do you have any changes? No. Okay,
6:406 minutes, 40 secondscontinue. Uh that sort of stuff just for principles. Uh and yeah, you're there.
6:466 minutes, 46 secondsUm so the use of GitHubs allows us to uh not just manage a single ship uh well the whole Kubernetes and everything the
Chapter 4: Scaling and architecture
6:556 minutes, 55 secondsthe whole u uh C and shipping um thing uh but you can uh manage the whole fleet
7:037 minutes, 3 secondsusing GitHubs uh in a quite easy way. Um so what you can do this well one of the
7:117 minutes, 11 secondsoptions obviously but uh you can have a a catalog like a uh umbrella hand chart
7:187 minutes, 18 secondswhich you put the uh required applications for you. It could be a search manager it could be ingress it could I mean it would be your own
7:257 minutes, 25 secondsapplication as well in a h umbrella hamchart. Then you have a um control plane cluster where you run Argo Seltos
7:357 minutes, 35 secondswhatever which gets the changes watch them gets changes and then um those are
7:417 minutes, 41 secondsapplied to the actual workload clusters well and in a reconciliation way. Uh and
7:507 minutes, 50 secondsfor those for tools and um for different tools and also for the same tool uh different there are different
7:577 minutes, 57 secondsapproaches. Uh it could be EPOP apps apps uh which are mostly used also application sets as well or if you are
8:058 minutes, 5 secondsusing uh flux you would be using overlays with custom lines and stuff.
8:118 minutes, 11 secondsUm but I mean even though there are different approaches the idea is the same. um you try not to repeat yourself.
8:208 minutes, 20 secondsUh you only have the chart uh or the application group of applications you want to have uh on your system and you
8:288 minutes, 28 secondsonly change some values uh and apply those to the cluster. Uh so yeah dev environment has a different number of
8:358 minutes, 35 secondsreplicas whereas the production has different number of replicas but they will be running the same application.
8:418 minutes, 41 secondsThat's the uh main idea and well you can have hundreds of
8:488 minutes, 48 secondsclusters and with a huge Helm chart and an umbrella chart where you can apply
8:548 minutes, 54 secondsthings. Um the here the thing is that in this case for example Argo is applying all those changes. So the execution is
9:029 minutes, 2 secondson on the Argo side. Um but that would that also creates some other problems
9:109 minutes, 10 secondssome other issues for us. So yeah it sces well um in general that's crazy to be honest you manage like 1000 cluster now but yeah with
9:189 minutes, 18 secondsscale comes multiple challenges. Yeah, there would be other challenges because uh now this leads to a complex confix uh
Chapter 5: Challenges at scale
9:269 minutes, 26 secondswhereas there are many clusters different values files um and it becomes uh a bit hard to
9:349 minutes, 34 secondsuh track which cluster as I mean if you have five clusters it's quite easy but if you are have uh tens of clusters or
9:429 minutes, 42 secondshundreds of clusters then things get really messy there.
9:469 minutes, 46 secondsuh and also a known example from crossplane. Uh I mean 2022 uh things has
9:559 minutes, 55 secondschanged now but at the time uh crossplane was creating too many CD tons of CDRs on on the Kubernetes API and it
10:0210 minutes, 2 secondssimply killed it because Kubernetes API was not able to uh process the incoming requests because there was too many uh objects to to go through.
10:1210 minutes, 12 secondsUm so scales well. Yes. But there are also some some limits to different things and
10:2010 minutes, 20 secondsalso uh the visibility is lost because now you have too many config files. Um
10:2610 minutes, 26 secondsand or the values files. Uh then you are not you may not find what is deployed
10:3410 minutes, 34 secondswhere in which setting that that becomes a bit harder. And also um so for example
Chapter 6: Source of truth reality
10:4210 minutes, 42 secondsif you are deploying a hand chart with argo or flux um you actually don't know what is be what the actual manifest will
10:5110 minutes, 51 secondslook like on the on the uh target host right so you change the values etc with the templating of the helm there would be a different uh type of or different
11:0011 minutesuh set of manifests deployed [snorts] um so you may need rendering first to check what will actually be applied to the
11:0811 minutes, 8 secondssystem and then uh you push those changes uh to to to the GitHubs tool what whatever you are pro using um
11:1611 minutes, 16 secondsthere's cooki or argo argo cd diff preview so the those ones will uh actually show you what actually will be
11:2511 minutes, 25 secondsapplied to the cluster and then um with the hydrator hydrator uh you will see act what actually will be uh running on
11:3411 minutes, 34 secondsthe system um so whenever we talk about uh githops we always say that yeah gre repo is the source of truth. Uh I mean I
11:4111 minutes, 41 secondsI've said it multiple times. It is same here. Sorry for that teaching you over the years that we saying good as a source of truth.
11:5011 minutes, 50 secondsIt is not 100% correct. Um so your yeah your intent is there. So what you
11:5811 minutes, 58 secondswant to have what your desired state is actually on Git. Yes. Uh but on the on the runtime side on the on the cluster
12:0512 minutes, 5 secondsitself uh there are multiple different components right. you get the uh image from an image repository. The ham chart
12:1212 minutes, 12 secondsis actually probably in somewhere else and you might have some dependent Ham charts uh which might have changed over
12:2012 minutes, 20 secondstime and you may not aware of those. So um yes what you want to have is on git but
12:2912 minutes, 29 secondsthe actual state uh on on the cluster might be different.
Chapter 7: Git vs OCI
12:3412 minutes, 34 secondsUm so what we say here is that git or OCI is the source of intent what you
12:4012 minutes, 40 secondswant to have on the cluster. Um but then again um not only because of the registers or stuff. So if you are
12:4912 minutes, 49 secondsprobably deploying a an operator uh operators also create their own objects right. So then Argo starts to uh send
12:5712 minutes, 57 secondsnotifications that hey this application is out of sync because the operator created an an object which is not in
13:0413 minutes, 4 secondsgit. So you then start to ignore this uh difference but then you also again lose the visibility of what is actually be on
13:1213 minutes, 12 secondsthe cluster and what is on on the git side. Uh so again uh g has your intention g has your
13:2213 minutes, 22 secondsdesired state but the actual state might be a bit different uh running on the cluster. Um so yeah g is great for the
13:3013 minutes, 30 secondsuh human collaboration and intent. Uh and yeah you can also use OCI uh instead of git. So even though uh it's called
13:3713 minutes, 37 secondsgithops it's a good name by I think but the principles I asked Alexis it is a good name. If you say kind of now we have the get in and
13:4513 minutes, 45 secondsit's become a little bit difficult to get rid of it.
13:4713 minutes, 47 secondsYeah, because I mean the the principle is that you want to um pull the uh
13:5513 minutes, 55 secondsdesired state from a uh versioned and immutable source in a loop. That's the idea. It could be l it it could be git.
14:0514 minutes, 5 secondsIt could be OCI. It could be uh somewhere else. It could be. Yeah, I think Flux also supports uh S3 buckets or so. So you can also
14:1414 minutes, 14 secondsI'm not 100% sure but I guess uh so yeah you can also use OCI address.
14:1914 minutes, 19 secondsSo the name is githops but doesn't have to be g it's about the principles. So uh there there's also uh from flux gun in
Chapter 8: GitOps architectures
14:2714 minutes, 27 secondsuh 2022 uh there's a to get this githops uh with OCI um yeah you can also go in
14:3414 minutes, 34 secondsthis direction to have your artifacts to be deployed on the cluster um well there are many different architectures and um yeah you can have
14:4314 minutes, 43 secondsthe um central hub or control plane where you manage the different clusters
14:5014 minutes, 50 secondsuh so the the hub pulls to changes and then pushes them to the uh to the related clusters or you can have
14:5714 minutes, 57 secondsdedicated instances per cluster. They all push and apply changes on the local cluster itself. Um you can also have
15:0615 minutes, 6 secondshubank spoke and dedicated instance. So a um let's say git is the source the control plane the hub cluster pulls the
15:1515 minutes, 15 secondschanges and then the actual workload clusters pulls the changes from that hub. that would also uh be u be an
15:2415 minutes, 24 secondsoption. Uh and also for hundreds of clusters, you should also be thinking about sharding and um yeah because the
15:3315 minutes, 33 secondsuh performance scale uh especially multiple clusters and too many applications to deploy uh things uh get
15:4115 minutes, 41 secondsa bit u yeah hard to scale sometimes. Um so we
15:4815 minutes, 48 secondsalso have the agent based architectures for example Seltos I've never used it but Artum is a Artum is a fan and um
15:5715 minutes, 57 secondsyeah you can have the Seltos as a hub cluster and it can just uh push the changes uh to the agents uh or uh the
16:0516 minutes, 5 secondsagent Seltos agent running in the workload cluster can pull the changes from the hub cluster itself.
16:1316 minutes, 13 secondsSo this whole GitHubs thing uh brought us to be able to manage secrets, dashboards, infrastructure, budget
16:2016 minutes, 20 secondsrules, uh policies, everything using different applications to be um managed and used as a code, right? But or well
16:3016 minutes, 30 secondsthis was a GitHub spot I mean and this is just happening in nine years now.
16:3316 minutes, 33 secondsEverything with the eye happening in one week. So yeah, we are kind of slow here.
16:3716 minutes, 37 secondsJust kidding. But in the meantime, what happening here? Deopos was declared as that. Uh from my point of view to be honest it was never a thing. I mean
Chapter 9: Rise of platform engineering
16:4516 minutes, 45 secondshaving an infinity loop with tools and I mean maybe the culture yes but to creating a role of it a role description
16:5316 minutes, 53 secondsand hire people for devops role by not defining what you want you're doing CI pipelines or not to be honest for me was never a thing but yeah we still hiring
17:0017 minutesand a lot of people still are devops engineers but what I want to point out platform engineering arise so we put this infinity loop or the tools from the
17:0817 minutes, 8 secondsinfinity pool tools from a tool chain and expanded like in more in planes more organized in planes And now we are saying if you want as a platform
17:1617 minutes, 16 secondsengineering team to build your internal develop platform or develop platform whatever you call it to provide a self-service you will organize it multiple more in planes. If you cover
17:2417 minutes, 24 secondsall these planes you can see here we have the developer plane control plane or some people call it developer experience plane we have for example the
17:3117 minutes, 31 secondsdelivery plane the githops engine where in it and you have another planes to create resources. This is what happening from our point of view. We organized
17:3917 minutes, 39 secondsthis infinity loop in more much more um organized architecture and moved away from Invia tools to giving it a purpose.
17:4717 minutes, 47 secondsBut central uh central platform teams are created to build it with platform engineering. Sorry human beabeled because if you're looking on LinkedIn a
17:5517 minutes, 55 secondslot of people are system engineer, cloud engineer, devops engineer, platform engineer getting a higher salary but doing the same task. checked out the link in profiles and this becoming a
18:0418 minutes, 4 secondslittle bit difficult but later on it so um same teams new mission same mindset relayable defoss teams now expected to
18:1118 minutes, 11 secondsbuild developer platform to increase the developer experience and also to provide self-service through the right abstraction of layer and we know all how
18:2018 minutes, 20 secondsit's how how we failed how it's how high is the adoption is we saw a lot of talks we did a lot of surveys about how high the adoption is here some numbers from
18:2918 minutes, 29 seconds2026 It's saying for example you need to build an internal web platform you need about spending some millions and the
18:3618 minutes, 36 secondsadoption rate still low and from my from our point of view yeah you need maybe to need about one and two year to build it
18:4318 minutes, 43 secondsbut you need about five and 10 years of engineering experience to build it in one and two years the difficult part that people don't see you can just hire
18:5118 minutes, 51 secondsand at the end of the day they will bypass there are multiple reasons for that but just to figure uh to pointing out too the same relable system engineers now need to build a product.
19:0019 minutesDominic gave a lot of talks also in this conference product mindset and he's not alone to building a platform and we are building infrastructure for
19:0819 minutes, 8 secondsinfrastructure. So the developers are not just software developers the developer of the platform are also product owner maybe you phenops part and
19:1619 minutes, 16 secondsyeah they bypass it because they are not thinking like infrastructure teams and another part of the low adoption is we will not speak about it we learned also
Chapter 10: Improving developer experience
19:2419 minutes, 24 secondsjust using backstage and deploying it and then we have it it's not an IDP it's still a framework to build your portal
19:3219 minutes, 32 secondsand like I say it's not an IDP out of the box you have a heavy customization and now you need to run I had a lot of um exchange last year and the people We
19:3919 minutes, 39 secondsdon't like to write react because we scripted a lot of stuff and now we need to develop software. Yeah, this is backstage was built for. If you have a really backstage is a really great tool.
19:4819 minutes, 48 secondsIf you understand it, if you understand the pain of Spotify, why they built it, then it's really nice. But also, I guess I saw some numbers the adoption rate of
19:5519 minutes, 55 secondsbackstage as a portal, it's under 10%. I don't know if it's true, but from my exchange, yeah, a lot of people just using it for documentation, but it's a
20:0320 minutes, 3 secondsreally great tool if you understand the purpose of it. And by building our platform we spoke about improving
20:1120 minutes, 11 secondsdeveloper experience but our also myself we realized we never asked the developer what they wanted. So we talk about technologies we are going to conference
20:1920 minutes, 19 secondslike this one saw a lot of shiny tools coming back implement and they say use it but not solving the problem. So we draw we put a lot of stuff on them
20:2620 minutes, 26 secondscustom resource definition githops pipelines container and maybe for us as infrastructure teams or however we call us today platform engineers of course
20:3420 minutes, 34 secondsbecause everyone is doing platform engineering was like we starting then about culture because githubs it's not
20:4120 minutes, 41 secondsit's about culture but it's not easy to understand what immutable infrastructure is you're pointing out we also realized now that git to rebuild your platform
20:4920 minutes, 49 secondsfrom git it's not possible because you have a lot of references if you're doing it for CI it's becoming much easier because you can put your images
20:5620 minutes, 56 secondstogether, your sbooms and all the stuff, but you still have secrets outside your cluster, your controller manipulated. So we start to understand the developers
21:0621 minutes, 6 secondssay hey in the past they allowed to do ad hoc changes at the cluster. Now you say everything Githops is a contract like you explain everything coming to
21:1421 minutes, 14 secondsthe contract githops in githops out for us this was purposely but I had some projects where the people say no I want having access you say no no no
21:2021 minutes, 20 secondseverything and now it's in git OCI and we also tried to explain to the developers that branches and githubs are antiattern but developers living in
21:2921 minutes, 29 secondsbranches over promotion we instantly t the developers trunkbased development is the new thing and promotion happening over folders no long branches just short
Chapter 11: Branches and automation
21:3921 minutes, 39 secondsliving branches and if you put you have like a baseline and then you have your values for your pro for your QA and your saging and you just promote over the
21:4621 minutes, 46 secondsfolder then we realized okay branches plus githops actually make sense with our human interaction so tools like cargo emerge and they're working really
21:5421 minutes, 54 secondswell I know a lot of project using them the idea is the same these tools allows you like to do click ops but behind the scene it's create branches which are
22:0322 minutes, 3 secondsintegrated in Argo CD I don't know if it's a real term but we call it today birectional githops because you having some as a developer your code commit
22:1222 minutes, 12 secondsyour push your changes arguous you apply it or if you're doing the promotion of a cargo you have another controller which also now writing back from your cluster
22:2022 minutes, 20 secondsto github so you have both ways I don't know if it's the right term but we use it because it's the most easy way for us to explain it and we also learned one thing if you
22:2822 minutes, 28 secondsadopt githubs correctly everything becomes possible easy not just killing APIs this is the fun part but you can deliver in continuous delivery progressive delivery progressive rollout
22:3722 minutes, 37 secondsand zero downtime if you're doing it the right way. And you may be asking wait what is progressive delivery? I mean we know it from Kubernetes rolling update
Chapter 12: Resilience and delivery
22:4422 minutes, 44 secondsyou have a new deployment and after you have it the deployment is deployed and if the part is healthy it will be deployed one by one but also a lot of
22:5322 minutes, 53 secondsteams using for example blue green deployments or canary deployments just to testing a new version and then integrated it. It's not directly built
23:0123 minutes, 1 secondin into your GitHubs engine but you can combine it with tools like Argo CD rollouts flagger and it's githops integrated. This is also what we are
23:0823 minutes, 8 secondsseeing happening in different project to test new version or to expose just a small person to the to to your test
23:1523 minutes, 15 secondsuser. Not just the progressive delivery but githubs also help us to build more resilient platforms. This especially what I like personally about it disaster
23:2423 minutes, 24 secondsrecovery become not a problem if you implement the right way for stateless cluster. Of course, if you have state, if you manage databases, then you have
23:3123 minutes, 31 secondsanother pain points to solve. And GitHubs becomes also if you're taking back a look at the reference architecture, the top four capability
Chapter 13: Modern platform tooling
23:4023 minutes, 40 secondsbased on our service we are doing worldwide of every platform to provide a safe service or to manage it and also keep it in zinc and githubs becomes the
23:4923 minutes, 49 secondsheart of modern platforms and also soon some factions are started to form. I don't know if you ever played World of Warcraft, but I'm giving some book signings and I was like every time I'm
23:5823 minutes, 58 secondsjust curious and asking the people, hey, are you using Flux or you're using Argo City and they like be on the right side.
24:0424 minutes, 4 secondsI don't know what the right side is, but you can see some communities building on that and strong communities. But for me, from point of view, I mean, we're getting also a lot of question like
24:1224 minutes, 12 secondswhich GitHubs should we choose? We are both consulting. So, you will get depends on this is the answer we're getting you and this is not a comparation of the tools. I just wanted
24:2024 minutes, 20 secondsto highlight that we for example as I consulting use all of the tools based on our project. So we like Argo City, we
24:2824 minutes, 28 secondslike Flux City and now we also like of course Swertos because I'm a huge fan and we published yesterday some numbers where you can see if you combine Argo
24:3624 minutes, 36 secondsCity with Sutotos how far you can scale and how many application you can manage and it's crazy I forgot to put the QR
24:4324 minutes, 43 secondscode on it. Sorry for that. And after choosing the GitHubs engine, Argos D flux city or combine them and all tools are in place now. We finally starting to
24:5124 minutes, 51 secondsbuild an internal web platform this time for real. But now you need also to decide after you understand it if you want to use backstage as a framework to build your portal. Or you would want for
25:0025 minutesexample if you don't have a platform team outsource this to a platformless experience like Hiokco Coro and having platform engineering teams building for
25:0925 minutes, 9 secondsyou and you're just paying the subscription. Or you can also use of course orchestrator operator-driven approaches where you integrate use services custom resource definition based into an operator and fulfill it.
25:1925 minutes, 19 secondsAnd this was really really nice because after years of failing this year I have the feeling that we finally got adoption from the developers because developers
25:2825 minutes, 28 secondsstarting question I have represent open Korea on cloudland this year in collaboration with CNCF and they are like okay the developers say how we can
25:3525 minutes, 35 secondsstill in our flow in our CLI EDA whatever they're using and connect to the platform um our agents for example
25:4325 minutes, 43 secondsand this was like okay open career has built in and I tested it it's look really really great because the developer saying Now I wanted for
25:5125 minutes, 51 secondsexample to deploy a new component web application. It doesn't exist. It will automatically now generate for you a pull request based on the request. Not
25:5925 minutes, 59 secondsjust only creating a ticket or something like this. It will create a pull request with the custom resource by the platform team. The platform team can review it, can adjust it, can apply it and it
26:0826 minutes, 8 secondsbecoming available over GitHubs because their custom resource definition applied and the developer can then use this self-service. And for me it was like I
26:1626 minutes, 16 secondsdon't know if it's the right way and if it will be called I don't know agentic developer platform or however but I can see here a huge of opportunities
26:2426 minutes, 24 secondsincreasing how we can collaborate now on common tools because I'm as a platform engineer using a lot of agents developer using it behaving like a common language
26:3326 minutes, 33 secondscommon pain points common token pain points and so on and also meanwhile AI is becoming a citizen of your platform what we meaning by that running AI on
Chapter 14: AI integration and data
26:4126 minutes, 41 secondsKubernetes is the easy part if you have a catalog you put it can put a label on it, it will deploy it but and you can provide inferences service but
26:4926 minutes, 49 secondsintegrated AI as real part it's becoming really difficult because inference service working maybe really sounds easy
26:5826 minutes, 58 secondsand a lot of people don't think about multi-tenency but k GPU sharing becomes really for small GPUs difficult because it's not like CPU sharing if you have a
27:0627 minutes, 6 secondssmall uh for example if you have a small process which is just using part of it it will consume the whole context of the
27:1427 minutes, 14 secondsGPU So a lot of people thinking now about multi-tenency approach to provide it and also what I want to what we wanted to point out it's not just you
27:2227 minutes, 22 secondsproviding an endpoint for your developer to consume it like self-hosted VLMA but you have also like agents now running as
27:2927 minutes, 29 secondspart of your platforms like uh homes GPT and CNCF project and they operate it so they have access to your cubernetes cluster to everything else and helps you
27:3827 minutes, 38 secondsto operate it so it's there becoming they need also capabilities and another stuff of your platform but we don't want to point out today too much to AI
27:4527 minutes, 45 secondsagents. We wanted to point out that AI troubleshooting or site rehability agents works really great because they have logs, matrix, traces, everything.
27:5527 minutes, 55 secondsThey have the rich context to explain you why the application showing you an error. And if you remember this part, we
28:0328 minutes, 3 secondscreated a lot of um complicated a lot of overlays. This is really really simple.
28:0728 minutes, 7 secondsPeople doing it much more crazy ways. So if you now try to use AI to generate parts of your platform, you will get generic answers to Helm and another
28:1628 minutes, 16 secondsstuff. So what we wanted to point out AI needs plain data. So configuration data becomes a thing. You're also pointing out to config or Alexis as they try to
Chapter 15: Regulations and future outlook
28:2528 minutes, 25 secondssolve it. And what is this meaning by that write everything twice what you see is what you get. You can see it on the from my right side. And if you're using
28:3328 minutes, 33 secondsfor example configuration as data, you have templates, you put values on it, the GitHubs engine fulfill it, and you don't know what coming out. And this is
28:4128 minutes, 41 secondsnot just only for AI. The regulation becomes a really a thing and Europe has created plenty of them and Mario Fand
28:4928 minutes, 49 secondsgiving a lot of talks about cyber resilience actually coming for us and now it's there. So you need to understand your whole chain and you can understand your whole chain if you're
28:5728 minutes, 57 secondsgetting the plain manifest the images the as everything you reference it if you provide a product so you can patch it because you will now getting liable
29:0429 minutes, 4 secondsfor that and yeah and we still have unsolved challenges coming to our last slide just pointing out for example Michael uh posted it on LinkedIn for
29:1229 minutes, 12 secondsexample you can see hydration based abstraction still have not a clear path hun generally doesn't have a good schema on maintenance or API versioning how you
29:2029 minutes, 20 secondscan support it what he's meaning by that or how interpreted it if you're having using a third party chart uh and you don't have some security context set you
29:2829 minutes, 28 secondscan fork it or you can put another layer on it like customize and patch it and it's becoming really crazy because we don't have a default and we have of
29:3629 minutes, 36 secondscourse another challenges but coming back I guess if you have some question we need to do it after that sorry for that we try to put everything together
29:4429 minutes, 44 secondsof 9 years and 30 minutes and we also don't cover some topics like event-driven githops platform so thank you very much and we were asked to ask
29:5329 minutes, 53 secondsyou about pointing out to this feedback code. I know how it works, but here is that. Thank you very much. Yeah, thank you very much.
30:0230 minutes, 2 seconds[music]
30:1230 minutes, 12 seconds[music]

Sync to video time
