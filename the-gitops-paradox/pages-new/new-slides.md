I'm Simon, have been an software engineer for years. Worked at companies big and small, and in the last 6 years I switched to DevOps and platform engineering in a smaller sized company: where we made the switch the Kubernetes. I don't work there anymore, since I learned that I was missing something. Something that I'm now trying to build. I'm here for 2 things: Telling and showing what I envision, and I would love to get your feedback. Don't spare me with your quistions: it's all not written in stone, so if you dare to dream with me than we certainly can make it better together.

I like files, I like everything beeing a file. No need to use custom tool, editor choice yours. Turns out that LLMs also like files.

So naturally, I also like git. And I like the process that you get with it: get feedback of others, have full transparancy, again no need to use custom tools. 

But as a human (and others) I also like visuals: a nice user interface, clicking around to get things quickly. Easier and faster paths to set things up, most of these things actually somehow require an API -> a server that quickly responds, validates and also shields users from the actual core. We have internal developer platforms in all kind of different ways: and most of them use an API. And I believe that it is an important direction as well. But somehow we every time need to loose our beatiful simple world: our files are gone, and some database is buzzing.

That's not bad in itself, but I like my files so much. I see the need for the API but I'm believing and advoating that I would like to have both. I like files, and I like an API. Well certainly not every API: but the Kubernetes API is pretty cool. 

But wait, the Kubernetes API is very important to our workloads, we need to protect it from people touching it. What if they do bad stuff?

Humanity has invented GitOps for a reason didnt they? So that we never touch our Kubernetes API by hand, the clusters feed themselves with git state. Git is the single source of truth.

Behind the Kubernetes API is the Kubernetes Resource Model (KRM). A very interesting design principle is that KRM resources are describing desired state. They have spec (and status). Most rest APIs that I worked with have both a url and body that need to be viewed togheter (make a curl call to the live weather in Adam). The inventors of the Kubernetes API took another route: they decided to decode both the body and the location in the body (make a live call to the Kubernetes API).

Let it sink in: the location of your file doesnt matter, the name doesnt matter. It's just the content that matters. Which is also why you can place multiple files in a single file. kubectl apply -f and GitOps for that matter are your friends.

This is perfect: and this is also allowd me to sketch the actual GitOps paradox. I have been overly protecting my precious production workloads, and I've been trying to add API's and I've been feeling guily of not adding both. But why can't we do GitOps in the other direction? What refrains us from doing that? What if we just place the Kubernetes API in front of our git repo? We keep the good old gitops process (and other properties). But we gain all the goodness of the Kubernetes API.

I've been searching: but I failed to find something that totally does this: I also noticed that doing this inside a small companies engineering team was to distracting: it's not serving both ends. So that's why I decide to quit my full time job. And to work on this fulltime. Bringing KRM to masses, helping people to use the Kubernetes API for their configuration.

The core of this is simple: place an extra Kubernetes in front.


