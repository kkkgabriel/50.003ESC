

## First download

1. Download Node.js and npm (npm comes together with node)
For non ubuntu users, go to [Node.js](https://nodejs.org/en/download/package-manager/) and follow their instructions.
For ubuntu users, use this in your terminal: <br>
`curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -` <br>
`sudo apt-get install -y nodejs`	

	You can verify if you have successfully installed node and npm, or if you already have them with these lines: <br>
`node -v`
	`npm -v`

    
2.  Clone the repo from github, by entering the following line into the terminal. <br>
 `git clone https://github.com/kkkgabriel/50.003ESC.git`
 
3. In your terminal, navigate into the directory and install the packages with: <br>
`npm install`

4. Test the app by deploying the HTTP server locally <br>
`nodemon main`

5. Open your browser and key in: `localhost:3000` in the address bar. If it doesn't work, seek help.

## Node.js


**Reference tutorials** (These are some youtube tutorials of some basic git usages):<br>
[NodeJS crash course](https://www.youtube.com/watch?v=w-7RQ46RgxU&list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp) (37 videos, but the first 30 videos are good enough)

## GIT

**Reference tutorials:** <br>
[Adding, commiting and pushing](https://www.youtube.com/watch?v=5HLst694D_Y) (4:45)<br>
[Branching](https://www.youtube.com/watch?v=JTE2Fn_sCZs) (6:36)<br>
[Merging](https://www.youtube.com/watch?v=JTE2Fn_sCZs) (7:10)<br>

**Starting up:**
1.  To checkout to a local branch that checkouts a branch from the remote branch:<br>
`git checkout --track origin/<your_branch_name>`

**Pushing changes to the remote branch:**
1. Add<br>
`git add [<files_you_have_made_changes_to>]`
2. Commit<br>
`git commit`
3.  Push<br>
`git push`

**Pulling changes made on the remote branch**
1. Pull<br>
`git pull`
 
**Merging 2 branches (For example: master branch with other branch)**
1. Checkout to master branch if not done so<br>
`git checkout master`
2. Merge<br>
`git merge other`