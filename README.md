# This project contains the following technologies

# To run the client and server via concurrently:
terminal powershell -> `npm i` (install dependencies)
terminal powershell -> `npm run all`
terminal powershell -> `npm run lint` (loading ESLint checker)
terminal powershell -> `npm run knip`

terminal powershell -> `npx drizzle-kit generate`
terminal powershell -> `npx drizzle-kit push`
terminal powershell -> `npx drizzle-kit migrate`
terminal powershell -> `npx drizzle-kit migrate reset`
terminal powershell -> `npx tsx scripts/seed-categories.ts` (seed Categories)

# GitHub commands:
terminal powershell -> `git pull origin master` (get latest changes)

terminal powershell -> `git add .` (add all changes)
terminal powershell -> `git commit -m "commit message"` (commit changes)
terminal powershell -> `git checkout -b <branch-name>` (create new branch)

terminal powershell -> `git push origin master` (push changes to master)
terminal powershell -> `git push origin <branch-name>` (push changes to branch)

# To run the ngrok tunnel
terminal CommandPrompt -> `ngrok config add-authtoken 2lKZpXotH2Iex2uCLicGRw5Y4Wv_219kEsPPGgs2yXeyE6iEx`
terminal CommandPrompt -> `ngrok http --url=notably-just-cheetah.ngrok-free.app 3000`