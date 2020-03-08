__Changes in requirement__
We are staying with the same requirements as documented in project meeting 1:

We have decided to model for a telco company, and we have identified a few categories that
we can work on. We have decided to design our routing engine as a filter system using
matching tags that assigns customers to the appropriate agents. We will design a Web UI
that shows a simulation of our routing engine.

__Formal documentation of Use case__

__Class diagram__

__Sequence diagram__

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
  test chat features | Agent opens char history | Previous messages available in history
  Test ability to rejects call | Caller maakes a call, agent rejects it | Rejection accepted, caller is still on queue
  test ability to accept calls | Caller makes a call, Agent accepts it | Connection success
  
  
  __User Interface__
  | Test  | Input | Expected output|
  ------|-------|--------
  Test for login | Caller enters a username | login success
  Test for login | Caller enters no username | login failure
  Test for multiple login | Agent logged in from 2 different devices | login success
  Test ability to request call | Caller makes a call to agent | Caller put on queue or Agent answers right away
  Test chat features | Caller sends message to agent | Agent receives message from caller
  Test chat features | Agent sends message to caller | Caller receives message from agent
  Test ability to make calls | Caller presses on the call button | Notify caller that a call has been made
  Test ability to select tagas | Caller select tags before making call | Agent assigned should be relevant to user's tags
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

__Workload distribution__