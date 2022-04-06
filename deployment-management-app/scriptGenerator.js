const generateScript=(token)=>{
    return [
        'cd /home/ubuntu/g39',
        'sudo rm -rf group39-frontend',
        'sudo rm -rf group39-backend',
        `git clone https://${token}@github.com/group39dynamo/group39-backend.git`,
        'cd group39-backend',
        'npm i',
        "tmux new -d 'sudo npm start > logs.out'",
        'cd ..',
        `git clone https://${token}@github.com/group39dynamo/group39-frontend.git`,
        'cd group39-frontend',
        'npm i',
        "tmux new -d 'sudo npm start > logs.out'",
    ]
}

module.exports = generateScript;