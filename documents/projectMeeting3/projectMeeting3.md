For a full view of this .md document, go to https://github.com/kkkgabriel/50.003ESC/blob/master/documents/projectMeeting3/projectMeeting3.md<br><br>
__Changes in requirement__<br>
We are staying with the same requirements as documented in project meeting 1:

We have decided to model for a telco company, and we have identified a few categories that
we can work on. We have decided to design our routing engine as a filter system using
matching tags that assigns customers to the appropriate agents. We will design a Web UI
that shows a simulation of our routing engine.

__Formal documentation of Use case__
![useCaseDiagram](useCaseDiagram.png)

__Class diagram__<br>
__1. User App__<br>
![User App Class Diagram](userAppClassDiagram.png)
__2. Agent App__<br>
![Agent App Class Diagram](agentAppClassDiagram.png)
__3. Routing Engine__<br>
![Routing Engine Class Diagram](routingEngineClassDiagram.png)

__Sequence diagram__
![sequenceDiagram](sequenceDiagram.png)

__Black Box testing__

__2 Types of black box testing__

Principle applied in this black box test is Equivalence class partitioning. 
This technique , input values into the system or application are divided into different classes or system based on the similarity of outcome
Hence, instead of using each and every input value we can now use any one value from the group/class to test the outcome. In this way, we can maintain the test coverage while we can reduce a lot of rework and most importantly the time spent.

We will stick with simple testing of main functionality which ensures that complex procedure will succeed

  __1. Functional Testing__
  We will test the functionality based on different feature
  
  __Routing engine feature__
  |Test  | Input | Expected output|
  ------|-------|--------
  1 caller and 1 agent | Caller makes a call to the agent | Connection Success
  2 caller and 1 agent | Two callers makes call at the same time | Connect 1 caller and queue the other
  1 caller and 2 agent | Caller makes a call | Connect caller to the agent with the right tag
  
  __Agent interface__
  |  Test  | Input | Expected output|
  ------|-------|--------
  Test for login | Agent enters correct username and correct password | login success
  Test for login | Agent enters correct username and correct password | login failure
  Test for multiple login | Agent logged in from 2 different devices | login success
  Test agent Dashboard( Call time ) | Agent makes a call for a minute | Add 1 minute to call time on dashboard
  Test agent Dashboard( Idle time ) | Agent idles in website for a minute | Add 1 minute to idle time on dashboard
  Test chat features | Agent send message to caller | Caller receives a message from agent
  Test chat features | Caller sends message to Agent | Agents receives a message from caller
  Test chat features | Agent opens char history | Previous messages available in history
  Test rerouting ability of agent | Agent clicks a button to reroute user to another agent, message sent by agent to user | User receives message from new agent
  Test agent no longer connected to user after rerouting | Agent A clicks a button to reroute user to agent B, Agent A then sends a message to user | User cannot receive message from agent A
  Test agent able to end conversation | Agent clicks a button to end conversation with user | diconnected conversation message pops up
  Test disconnected converstation | Agent sends message to user | User cannot receive the message

  
  
  
  
  __User Interface__
  | Test  | Input | Expected output|
  ------|-------|--------
  Test for login | Caller enters a username | login success
  Test for login | Caller enters no username | login failure
  Test Routing completed successfully to correct agent | Caller selects a tag | Routed to correct
  Test chat features | Caller sends message to agent | Agent receives message from caller
  Test chat features | Agent sends message to caller | Caller receives message from agent
  Test if messages are sent from redirected user to new agent | User redirected to another agent and sends a messsage | Agent able to receive message from redirected user
  Test if user has been properly diconnected from agent | User sends message to agent | No message is registered due to successful disconnection
  Test NLP system | Caller types a sentemce | Keyword that is relevant to our available tags.
  

  
__2. Non- functional Testing__
  possible test are
  - Load testing
  - Stress testing
  - Usability testing
  - Scalability testing
  
  Might want to look into misuse case.
  tools you can use is up to you.
  selemium for web app, can use all the time

__Workload distribution__<br>
Refer to commit history on https://github.com/kkkgabriel/50.003ESC
