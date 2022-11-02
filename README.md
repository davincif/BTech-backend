# BTech Backend Proejct

### **How to run**

- dev mode

  ```shell
  npm ci
  npm rum start
  ```

- production mode

  ```shell
  npm run build
  ```

### **About the Architecture**

Firstly, it's importante to noticed that: although made fully is _Javascipt_ as requested in a non-funciton requerement, this project, in a real world scenerio, would be way better served using _Typescritp_, and that would be my strong advice in such a case.

I intended to use a _Ports and Adaptros Architecture_ AKA Hexagonal Architecture, and here are a few reasons why:

- Considering my lack of time (due to other aspets of my life), i new I would have roughly 2 days full days and a couple of hours more to attend all points requested in the requirements.
- The above point considered, I decided to focous absolutelly in the core of the application and, as suggested by Robert C. Martin (AKA uncle Bob) in his book _Clean Architecture_, everything else but the core is a detail, express is a detail, databases, libraies, everything is a detail but the core of the application.
- Once the core is put into place intecting with all other layes through interfaces (in the case of pure JS, using objects and well defined and documented function calls), to change the data base from technology A to B is a matter of reimplementing the Interface in the new tech and "voilà".

Dispite all that have been said this architecture brings also brings some problems with it, and I'm gonna expose some of my difficulties down bellow:

- In the end, getting this architecture tunned just right without some sort of typing or the use of interfaces became a pain and took me some hours. It made me doubt the whole idea after I was too commited to it.
- The whole lack of interface thing needs attention all on intself, I admit I feel I never got quit right the inversion principal in typescript specifially. But as warned by uncle Bob himself, it is something that takes a couple of attempt until you get just right, so I consider myself in the "knowledge path" sorta saying. Now if in Typscript I'm still making adjustments to it, in pure javascript ─ which I take quite a while without touching ─ it was a challage all on it's onw, in not fully overcamed in my opinion.
- Also, the overhead with the object translation ─ again, without the typings to help ─ got confuse at some point. Nevertheless I reassure its importance! Otherwise the layers would not bet properly isolated.

### **About the Project**
In the end of the day I felt good with the final result and I'm gonna quickly tell you the strongest and weakest point of it from my perspective.

By far, the best point of this solution, is how easy it would be to change the requirements, the technologies, the libraries, pretty much everything would have a minimized develoment cost to be changed, updated or **delayed**! ─ And that's a key word here 😉. This capability is usually highly appreciated by the business sector of the any interprise 😎.

We have some down points, for exemple: although perhaps delaying the decision of which database to use **is** the right decision to take in a real world environment, that not necesserally true for a job enterview 😅. I get that. But I decided to maintain this decision anyways, so dispite that fact thta I do not consider it a bad decision I wanted to mention anyways.

But the worse of them, is the error treatment and code repetition due to it 🤦‍♂️. Looking on the bright side, given that the layes are separated you would work on each layers error treatment individually or make a fully librari on itself for that and save some precious developer's hours.

NOTE: all of this in my opinion, that obviously is not solemn nor immutable truths. In fact I'm anxious to know what you guys think about it 🤩


### **API Docs**

Import the file _BTech.postman_collection.json_ on your Postman client
