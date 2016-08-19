/* ---- solitaire.js ----------------------------------------
 * Implementation of a Klondike (Draw 3) style solitaire game
 * ---------------------------------------------------------- */
function Suit(name, color) {
    this.name = name;
    this.color = color;
}

function Card(suit, value) {
    this.suit = suit;
    this.value = value;
    this.faceUp = false;

    this.flip = function() {
        this.faceUp = !(this.faceUp);
    };

    this.getImagePath = function() {
        return "img/club_" + this.value + ".jpg";
        //return "img/" + this.suit.name + "_" + this.value + ".jpg";
    }

    this.compareColor = function(card) {
        if(this.suit.color === card.suit.color)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    this.canAddToFoundation = function(card) {
        if((this.suit === card.suit) && ((this.value - 1) === card.value))
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    this.canAddToColumn = function(card) {
        if(!(this.compareColor(card)) && ((this.value + 1) === card.value))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

function Deck() {
    this.suits = [(new Suit("club", "black")), (new Suit("diamond", "red")), (new Suit("heart", "red")), (new Suit("spade", "black"))];

    /* --- Values ---
       1 ----=-> ace
       2 - 10 -> face value
       11 ---=-> jack
       12 ---=-> queen
       13 ---=-> king */
    this.values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    this.cards = [];

    this.create = function() {
        /* Add ace thru king to the deck for each suit */
        for(var i = 0; i < this.suits.length; i++)
        {
            for(var j = 0; j < this.values.length; j++)
            {
                var card = new Card(this.suits[i], this.values[j]);
                this.cards.push(card);
            }
        }
    };

    this.shuffle = function() {
        /* Based on Fisher-Yates shuffle algorithm */
        var currIndex = this.cards.length, tempVal, randIndex;

        /* While there remains element to shuffle... */
        while(currIndex !== 0)
        {
            /* Pick a remaining element... */
            randIndex = Math.floor(Math.random() * currIndex);
            currIndex -= 1;

            /* And swap with current element */
            tempVal = this.cards[currIndex];
            this.cards[currIndex] = this.cards[randIndex];
            this.cards[randIndex] = tempVal;
        }
    };

    this.empty = function() {
        for(var i = 0; i < this.cards.length;)
        {
            this.cards.pop();
        }
    }
}

function Solitaire() {
    /* --- Possible card locations --- */
    /* Deck */
    this.deck = new Deck();

    /* Pile */
    this.pile = [];

    /* Foundations */
    this.f1 = [];
    this.f2 = [];
    this.f3 = [];
    this.f4 = [];

    /* Columns */
    this.c1 = [];
    this.c2 = [];
    this.c3 = [];
    this.c4 = [];
    this.c5 = [];
    this.c6 = [];
    this.c7 = [];

    this.columns = [this.c1, this.c2, this.c3, this.c4, this.c5, this.c6, this.c7];

    /* --- Game methods --- */
    this.createGame = function() {
        /* Start by creating and shuffling the deck... */
        this.deck.create();
        this.deck.shuffle();

        /* Then distribute cards to columns */
        for(var i = 0; i < this.columns.length; i++)
        {
            /* Add cards until number of cards equals column number */
            for(var j = 0; j < i + 1; j++)
            {
                var card = this.deck.cards.pop();
                this.columns[i].push(card);
            }

            /* Flip the last card added up */
            this.columns[i][j - 1].flip();
        }
    };

    this.drawCards = function() {

    };

    this.updateBoard = function() {
        /* Update the deck and pile */
        if(this.deck.cards.length > 0)
        {
            $(".deck").attr("src", "img/cardback.jpg");
        }
        else
        {
            $(".deck").attr("src", "img/blank.jpg");
        }

        /* Update the main playing area */
        for(var i = 0; i < this.columns.length; i++)
        {
            for(var j = 0; j < this.columns[i].length; j++)
            {
                if(this.columns[i][j].faceUp)
                {
                    var cardLocation = "#r" + (j + 1) + "c" + (i + 1);
                    $(cardLocation).attr("src", this.columns[i][j].getImagePath());
                }
            }
        }
    };
}

$(document).ready(function() {
    var s = new Solitaire();
    var cardSelected = false;

    s.createGame();

    s.updateBoard();
});
