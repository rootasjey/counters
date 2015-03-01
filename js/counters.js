// ------------------------------
// COUNTERS.JS (PROJECT COUNTERS)
// ------------------------------
// NOTE :
// The loadFromFile & saveToFile methods are disabled (commented) in the code
// because these methods needs a server-logic like io.js, node.js, php, python, etc.
// If you want a real exemple, see the link : http://github.com/rootasjey/sideffects

// Initial players array
var _players = ['Coffe Script', 'Jquery', 'Mysqli', 'Mysqlii'];

// Contains player's statistics
var _stats = {};

// Fired up when the page is completly loaded
window.onload = function () {
    // Add players to the table
    pushPlayers(_players);

    // Events
    clickPlusOne();
    clickMinusOne();
    clickSave();
    clickPayed();
    clickSaveTaxes();
    clickAddPlayer();
    clickRemovePlayer();
    // Load data
    // This method needs a server logic
    // loadFromFile();
}

// Add players to the table
function pushPlayers(players) {
    for (var i = 0; i < players.length; i++) {

        // Contains player's values
        var player = [];

        // Push initial values
        player.push(players[i]);
        player.push(0);
        player.push("1000K");
        player.push(0);
        player.push("+");
        player.push("-");
        player.push("x");

        // Contains data types for the player array
        var dataTypes = [];

        // Values match these types
        dataTypes.push("name");
        dataTypes.push("points");
        dataTypes.push("taxes");
        dataTypes.push("total");
        dataTypes.push("plus");
        dataTypes.push("minus");
        dataTypes.push("delete");

        // Add elements to the DOM
        addRow(player, dataTypes);
        addCard(player, dataTypes);
    }
}

// Add a row to the table
function addRow(player, dataTypes) {
    var tableBody = $("#counters tbody");
    var tr = $("<tr>");

    for (var i = 0; i < player.length; i++) {
        var col = $("<td>", {
            html: player[i],
            'data-type': dataTypes[i]
        });

        col.appendTo(tr);
        tr.attr(dataTypes[i], player[i]);
    }
    tr.appendTo(tableBody);
}

// Add +1 to the points counter
function clickPlusOne() {
    $("td[data-type='plus']").click(function () {
        var tr = this.parentNode;
        var children = tr.childNodes;
        var points = children[1];

        points.innerHTML = parseInt(points.innerHTML) + 1;
        refresh(children);
    });
}

// Add a player
function clickAddPlayer() {
   
    $(".add-player").click(function () {

        var name = $("#add-player input[name='player_name']");

        name = (name.val() !== '') ? name.val() : "guest"+ (new Date()).getTime();

        AddPlayer(name);
    });
}

// Delete a player
function clickRemovePlayer() {
    $("td[data-type='delete']").click(function () {
        var tr = this.parentNode;
        var player_name = tr.attr("name");
        deletePlayer(player_name);
}

// Remove +1 to the points counter
function clickMinusOne() {
    $("td[data-type='minus']").click(function () {
        var tr = this.parentNode;
        var children = tr.childNodes;
        var points = children[1];

        points.innerHTML = parseInt(points.innerHTML) - 1;
        refresh(children);
    });
}

// Refresh the table
function refresh(children) {
    total(children);
}

// Calculate the total amount of fees
function total(children) {
    var points = children[1];
    var taxes = children[2];
    var total = children[3];

    total.innerHTML = points.innerHTML * parseInt(taxes.innerHTML);
}

// Add a player's card to the page
function addCard(player, dataTypes) {
    var card = $('<div>', {
        class       : 'card',
        "player"    : player[0]
    });

    var player = $('<span>', {
        class: 'title',
        html: player[0]
    })
    var due = $('<div>', {
        class: 'due',
        html: "due : <span class='amount'>0</span>",
    });
    var payedButton = $("<div>", {
        class: 'payed-button',
        html: 'payed?'
    });

    card.append(player).append(due).append(payedButton);
    $(".center-content").append(card);
}

//  Click Event on the save button
// - Save the valu to the player's card
function clickSave() {
    $(".save").click(function () {
        var children = $("#counters tbody tr");
        for (var i = 0; i < children.length +1; i++) {
            if (i == children.length) {

                // This method needs a server logic
                // saveToFile();
                break;
            }
            updateCard(children[i]);
        }
    });
}

// Update the card with the updated values
function updateCard(player) {
    // The playe's name
    var name = player.getAttribute("name");

    // The card element
    var card = $(".card[player='"+ name +"']");

    // The table row containing all the informations needed
    var row = $("tr[name='" + name + "']");

    // The total amount
    var total = row.find("td[data-type='total']").html();

    // Update the value
    var newTotal = parseInt(card.find(".amount").html()) + parseInt(total);
    card.find(".amount").html(newTotal);

    // Reset the player's points
    clearValues(name);


    // Save stats
    var stats = {};

    stats['fees'] = newTotal;
    _stats[name] = stats;
}

// Clear the points values in the counters table
function clearValues(name) {
    $("#counters tr[name='" + name + "'] td[data-type='points']").html(0);
    $("#counters tr[name='" + name + "'] td[data-type='total']").html(0);
}

// Clear the fees for a player
function clickPayed() {
    $(".payed-button").click(function () {
        var parent = this.parentNode;
        var name = parent.getAttribute("player");

        $(".card[player='"+ name +"']").find(".amount").html(0);
        // console.log(parent);
    });
}

// Update new taxes
function clickSaveTaxes() {
    $(".save-taxes").click(function () {
        // Get the default taxes element
        var taxes = $("#taxes-table input[data-type='taxes']");

        // Get the value
        taxes = (taxes.val() !== '') ? taxes.val() : 0;
        taxes = parseInt(taxes);

        // Put the updated value in the taxes-table
        $("#taxes-table .taxes-value").html(taxes);

        // // Put the updated value in the counters table
        $("#counters td[data-type='taxes']").html(taxes + "K");
    });
}

// Save stats to a file to retrieve values later
function saveToFile() {
    var jsonArray = JSON.stringify(_stats);
    jsonArray = encodeURIComponent(jsonArray);

    // Send an Ajax request to the server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/counters/save?json=' + jsonArray, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(null);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // console.log("Data correctly saved!");
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
            // Notify to the user that an error happened
        }
    }
}

function loadFromFile() {
    // Send an Ajax request to the server
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/counters/load', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(null);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // console.log("Data correctly loaded!");
            var response = xhr.response;
            fillData(response)
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
            // Notify to the user that an error happened
        }
    }
}

// Populate object with previously saved data
function fillData(data) {
    data = JSON.parse(data); // parse the data

    // Loop into the data
    // to get the list of the last saved players
    for (player in data) {
        if (data.hasOwnProperty(player)) {
            _players.push(player);
        }
    }

    // Create rows' and cards' players
    pushPlayers(_players);

    // Loop into the data
    // to update player's cards
    for (player in data) {
        if (data.hasOwnProperty(player)) {
            // Get the player's card element
            var card = $(".card[player='"+ player +"']");

            // Update the value
            card.find(".amount").html(data[player].fees);
        }
    }
}

//Delete player in object storage
function deletePlayer(player_name){
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/counters/delete?name='+player_name, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(null);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            loadFromFile();
            alert("Player correctly deleted!");
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
            
        }
    }
    
}

//Delete player in object storage
function AddPlayer(player_name){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/counters/add?name='+player_name, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(null);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            loadFromFile();
            alert("Player correctly added!");
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {

        }
    }

}
    
    
//server side
    
    .get('/counters/delete', function (req, res) {
        // Path to the json file (to save)
        var file = __dirname + '/public/modules/counters/data.json';

        
        var obj = jf.readFileSync(file);
        obj[req.query.name] = null;
        delete obj[req.query.name];
        
        
        // Open and write in the file
        jf.writeFileSync(file, obj);
    })
    
    .get('/counters/add', function (req, res) {
        // Path to the json file (to save)
        var file = __dirname + '/public/modules/counters/data.json';


        var obj = jf.readFileSync(file);
        obj[req.query.name] = {"fees": 0};


        // Open and write in the file
        jf.writeFileSync(file, obj);
    })