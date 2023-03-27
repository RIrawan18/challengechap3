class Player{
    constructor(){
        this.score = 0;
        this.win = null;
        this.selected = null;
    }
    reset(){
        this.win = null;
        this.selected = null;
    }
    resetScore(){
        this.score = 0;
    }
}

class Game{
    constructor(players){ 
        if (this.constructor === Game) {
            throw new Error('Error');
        }
        this.players = players;
    }

    reset(){
        for (const player of players) {
            player.resetScore();
        }
    }
}

class User extends Player{
    constructor(){
        super();
    }

    choose(choice){
        this.selected = choice;
    }
}

class Computer extends Player{
    constructor(){
        super();
    }

    roll(elements){
        const choices = Object.values(GamePlay.choices);
        const randomIdx = Math.floor(Math.random() * choices.length)
        this.selected = choices[randomIdx];

        elements.forEach(function(element){ 
            element.classList.remove('active');
            if (element.dataset.choice === choices[randomIdx]){
                element.classList.add('active');
            }
        });
    }
}

class GamePlay extends Game{
    static choices = {
        ROCK: 'rock',
        PAPER: 'paper',
        SCISSOR: 'scissor',
    };
    constructor(user, computer) {
        super([
            user,
            computer,
        ]);
    }

    pemain(choice){
        this.players[0].choose(choice);
    }

    komputer(elements, result){
        const interval = setInterval(() => {
            this.players[1].roll(elements);
        }, 3);

        
        setTimeout(() => {
            clearInterval(interval);

            this.#determineResult();
        }, 3);
    }

    #determineResult(){
        if (
            this.players[0].selected !== null && this.players[1].selected !== null
        ) {
            const [user, comp] = this.players;
            const computerWins = (
                    user.selected === GamePlay.choices.ROCK &&
                    comp.selected === GamePlay.choices.PAPER
                ) || (
                    user.selected === GamePlay.choices.PAPER &&
                    comp.selected === GamePlay.choices.SCISSOR
                ) || (
                    user.selected === GamePlay.choices.SCISSOR &&
                    comp.selected === GamePlay.choices.ROCK
                );

            const userWins = (
                    user.selected === GamePlay.choices.ROCK &&
                    comp.selected === GamePlay.choices.SCISSOR
                ) || (
                    user.selected === GamePlay.choices.PAPER &&
                    comp.selected === GamePlay.choices.ROCK
                ) || (
                    user.selected === GamePlay.choices.SCISSOR &&
                    comp.selected === GamePlay.choices.PAPER
                );

            document.getElementById('vs').style.display = 'none';
            if (computerWins){
                comp.score++;
                comp.win = true;
                user.win = false;

                document.getElementById('computerWin').style.display = 'block';
            } else if (userWins){
                user.score++;
                user.win = true;
                comp.win = false;

                document.getElementById('userWin').style.display = 'block';
            } else{
                document.getElementById('draw').style.display = 'block';
            }
            console.log(user.score, computer.score);
        }
    }
}

const user = new User();
const computer = new Computer();
const pilihan = new GamePlay(user, computer);
const buttonsPilihanUser = document.querySelectorAll('#user .choice');
const buttonsPilihanComp = document.querySelectorAll('#computer .choice');
const resetBtn = document.getElementById('resetButton');

buttonsPilihanUser.forEach(function(element) {
    element.addEventListener('click', function() {
        buttonsPilihanUser.forEach(function(elements) {
            elements.setAttribute('disabled', '');
        });
        element.classList.add('active');
        pilihan.pemain(element.dataset.choice);
        pilihan.komputer(buttonsPilihanComp);
    });
});

resetBtn.addEventListener('click', function() {
    buttonsPilihanUser.forEach(function(element) {
        element.classList.remove('active');
        element.removeAttribute('disabled');
    });
    buttonsPilihanComp.forEach(function(element) {
        element.classList.remove('active');
    });

    document.getElementById('vs').style.display = 'block';
    document.getElementById('computerWins').style.display = 'none';
    document.getElementById('userWins').style.display = 'none';
    document.getElementById('draw').style.display = 'none';
});