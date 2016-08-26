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
        return "img/" + this.suit.name + "_" + this.value + ".jpg";
    }

    this.compareColor = function(column) {
        if(this.suit.color === column[column.length - 1].suit.color)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    this.canAddToFoundation = function(foundation) {
        /* Check if foundation is empty... */
        if(foundation.length > 0)
        {
            /* It's not so check if the card can be added to the top */
            if((this.suit === foundation[foundation.length - 1].suit) && ((this.value - 1) === foundation[foundation.length - 1].value))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            /* It is so check if the card being added is an ace */
            if((this).value === 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };

    this.canAddToColumn = function(column) {
        if(column.length > 0)
        {
            /* Non-empty column so check if card being added is alternate color and that value is one less 
               than current column ending card */
            if(!(this.compareColor(column)) && ((this.value + 1) === column[column.length - 1].value))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            /* Empty column so see if card being added is a king */
            if(this.value === 13)
            {
                return true;
            }
            else
            {
                return false;
            }
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

    this.foundations = [this.f1, this.f2, this.f3, this.f4];

    /* Columns */
    this.c1 = [];
    this.c2 = [];
    this.c3 = [];
    this.c4 = [];
    this.c5 = [];
    this.c6 = [];
    this.c7 = [];

    this.columns = [this.c1, this.c2, this.c3, this.c4, this.c5, this.c6, this.c7];

    this.moves = 0;

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
        /* Check if deck is empty */
        if(this.deck.cards.length > 0)
        {
            /* Determine number of cards to draw */
            if(this.deck.cards.length >= 3)
            {
                for(var i = 0; i < 3; i++)
                {
                    var c = this.deck.cards.pop();
                    c.flip();
                    this.pile.push(c);
                }

                this.updateBoard();
            }
            else
            {
                while(this.deck.cards.length > 0)
                {
                    var c = this.deck.cards.pop();
                    c.flip();
                    this.pile.push(c);
                }

                this.updateBoard();
            }
        }
        else
        {
            /* Deck is empty, check pile */
            if(this.pile.length > 3)
            {
                console.log("regen deck");

                /* Replace deck with pile */
                while(this.pile.length > 0)
                {
                    var c = this.pile.pop();
                    c.flip();
                    this.deck.cards.push(c);
                }

                for(var i = 0; i < 3; i++)
                {
                    var c = this.deck.cards.pop();
                    c.flip();
                    this.pile.push(c);
                }

                this.updateBoard();
            }
            else
            {
                /* Deck and pile are empty - invalid move */
                this.setMessage("Invalid move!");
            }
        }
    };

    this.updateBoard = function() {
        /* Update the deck */
        if(this.deck.cards.length > 0)
        {
            $(".deck").attr("src", "img/cardback.jpg");
        }
        else
        {
            $(".deck").attr("src", "img/blank.jpg");
        }

        /* Update the pile */
        if(this.pile.length > 0)
        {
            $(".pile").attr("src", this.pile[this.pile.length - 1].getImagePath());
        }
        else
        {
            $(".pile").attr("src", "img/blank.jpg");
        }

        /* Update the foundations */
        for(var i = 0; i < this.foundations.length; i++)
        {
            if(this.foundations[i].length > 0)
            {
                var foundationLoc = "#f" + (i + 1);
                $(foundationLoc).attr("src", this.foundations[i][this.foundations[i].length - 1].getImagePath());
            }
        }

        /* Update the main playing area */
        for(var i = 0; i < this.columns.length; i++)
        {
            if(this.columns[i].length === 0)
            {
                var cardLocation = "#r1c" + (i + 1);
                $(cardLocation).attr("src", "img/blank.jpg");
            }
            for(var j = 0; j < this.columns[i].length; j++)
            {
                if(this.columns[i][j].faceUp)
                {
                    var cardLocation = "#r" + (j + 1) + "c" + (i + 1);
                    $(cardLocation).attr("src", this.columns[i][j].getImagePath());
                }
            }
        }

        this.setMoves("Moves: " + this.moves);

        /* Clear message box */
        this.setMessage("");
    };

    this.setMoves = function(movesStr) {
        $("#moves").text(movesStr);
    }

    this.setMessage = function(messageStr) {
        if(messageStr.length > 0)
        {  
            $("#message").text(" - " + messageStr);
        }
        else
        {
            $("#message").text("");
        }
    };

    this.getColumn = function(obj) {
        var currColIdx = parseInt(obj.attr("id").substr(3)) - 1;
        if(isNaN(currColIdx))
        {
            currColIdx = parseInt(obj.attr("id").substr(4)) - 1;
        }
        return this.columns[currColIdx];
    };

    this.getFoundation = function(obj) {
        var currFoundationIdx = parseInt(obj.attr("id").substr(1)) - 1;
        return this.foundations[currFoundationIdx];
    };

    this.getCard = function(obj) {
        if(obj.hasClass("pile"))
        {
            return this.pile[this.pile.length - 1];
        }
        else
        {
            var currRowIdx = parseInt(obj.attr("id").substr(1,1)) - 1;
            return this.getColumn(obj)[currRowIdx];
        }
    };
}

$(document).ready(function() {
    var s = new Solitaire();
    var clicked = false;

    s.createGame();

    s.updateBoard();

    $("img").click(function() {
        if(clicked)
        {
            var prevCard = s.getCard(s.clickedCard);
            console.log("Prev card: " + prevCard.value + prevCard.suit.name);

            /* --- CLICKED SAME CARD --- */
            if($(this).attr("src") === s.clickedCard.attr("src"))
            {
                $(this).removeClass("clicked");
                clicked = false;
                console.log("SAME");
            }
            /* --- INVALID MOVE --- */
            else if($(this).attr("src") === "img/cardback.jpg")
            {
                s.setMessage("Invalid move!");
                s.clickedCard.removeClass("clicked");
            }
            /* --- MOVE TO FOUNDATION --- */
            else if($(this).attr("id").indexOf("f") >= 0)
            {
                var targetFoundation = s.getFoundation($(this));
                console.log("Attempting to move to " + $(this).attr("id"));

                if(prevCard.canAddToFoundation(targetFoundation))
                {
                    if(s.clickedCard.hasClass("pile"))
                    {
                        targetFoundation.push(s.pile.pop());
                    }
                    else
                    {
                        var prevCol = s.getColumn(s.clickedCard);
                        targetFoundation.push(prevCol.pop());
                        if(prevCol.length > 0)
                        {
                            prevCol[prevCol.length - 1].flip();
                            s.clickedCard.addClass("hidden");
                            console.log(s.clickedCard.attr("id"));
                        }
                    }
                    s.updateBoard();
                }

                s.clickedCard.removeClass("clicked");
            }
            /* --- MOVE BETWEEN COLUMNS --- */
            else if($(this).attr("id").indexOf("r") >= 0)
            {
                /* Attempting to add card to column */
                var targetColumn = s.getColumn($(this));
                console.log("Attempting to move to column" + parseInt($(this).attr("id").substr(3)));

                if(prevCard.canAddToColumn(targetColumn))
                {
                    if(s.clickedCard.hasClass("pile"))
                    {
                        if(targetColumn.length > 0)
                        {
                            var targetId = "#r" + (parseInt($(this).attr("id").substr(1,1)) + 1) + $(this).attr("id").substr(2);
                            $(targetId).toggleClass("hidden");
                        }
                        targetColumn.push(s.pile.pop());
                    }
                    else
                    {
                        var prevCol = s.getColumn(s.clickedCard);

                        /* MOVING SINGLE CARD */
                        if(prevCol.length === parseInt(s.clickedCard.attr("id").substr(1,1)))
                        {
                            if(targetColumn.length > 0)
                            {
                                var targetId = "#r" + (parseInt($(this).attr("id").substr(1,1)) + 1) + $(this).attr("id").substr(2);
                                $(targetId).removeClass("hidden");
                            }
                            targetColumn.push(prevCol.pop());
                            if(prevCol.length > 0)
                            {
                                prevCol[prevCol.length - 1].flip();
                                s.clickedCard.addClass("hidden");
                            }
                        }
                        /* MOVING A STACK */
                        else
                        {
                            /* Holds the stack of cards to be moved */
                            var tempCards = [];

                            /* Get the number of cards to be moved */
                            /* (1 is added since the columns are not zero based indexed) */
                            var diff = prevCol.length - s.clickedCard.attr("id").substr(1,1) + 1;

                            /* Get the length of the source column before moving any cards */
                            var prevLength = prevCol.length;

                            /* Remove the cards from the source column */
                            for(var i = 0; i < diff; i++)
                            {
                                tempCards.push(prevCol.pop());

                                /* Hide the card placeholder as long as it's not the base card (empty spot) */
                                if(prevCol.length > 0)
                                {
                                    //parseInt(s.clickedCard.attr("id").substr(1,1))
                                    var removalStr = "#r" + (prevLength - i) + s.clickedCard.attr("id").substr(2);
                                    $(removalStr).addClass("hidden");
                                    console.log("Hiding " + removalStr);
                                }  
                            }

                            /* Add the cards to the destination column */
                            for(var i = 0; i < diff; i++)
                            {
                                targetColumn.push(tempCards.pop());

                                /* Unhide the card placeholder */
                                var targetId = "#r" + (parseInt($(this).attr("id").substr(1,1)) + 1 + i) + $(this).attr("id").substr(2);
                                $(targetId).removeClass("hidden");
                                console.log("Unhiding " + targetId);
                            }

                            /* If there was a facedown card under the cards that were moved, flip it over */
                            if(prevCol.length > 0)
                            {
                                prevCol[prevCol.length - 1].flip();
                            }
                        }
                    }

                    s.moves++;
                    s.updateBoard();    
                }

                s.clickedCard.removeClass("clicked");
            }

            clicked = false;
            console.log(" ");
        }
        else
        {
            if($(this).attr("src") === "img/cardback.jpg")
            {
                /* Could be the deck or a buried column card */
                if($(this).hasClass("deck"))
                {
                    /* Clicked on non-empty deck so draw cards */
                    s.moves++;
                    s.drawCards();
                }
                else
                {
                    /* Clicked on buried column card - invalid move */
                    s.setMessage("Invalid move!");
                }
            }
            else if($(this).attr("src") === "img/blank.jpg")
            {
                /* Clicked on empty deck, try to bring back cards from pile */
                if($(this).hasClass("deck"))
                {
                    s.drawCards();
                }
                else
                {
                    s.setMessage("Invalid move!");
                }
            }
            else
            {
                s.clickedCard = $(this);
                s.clickedCard.addClass("clicked");
                clicked = true;
            }
        }
    });
});
