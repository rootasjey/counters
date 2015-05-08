/** In this file, we create a React component which incorporates components provided by material-ui */

var React       = require('react'),
    mui         = require('material-ui'),
    Table       = require('reactable').Table,
    Tr          = require('reactable').Tr,

    FloatingActionButton = mui.FloatingActionButton,
    RaisedButton         = mui.RaisedButton,
    FlatButton           = mui.FlatButton,
    TextField            = mui.TextField,
    Dialog               = mui.Dialog,
    Snackbar             = mui.Snackbar;


var _timeoutBubble = null;       // this is a pointer to start the Bubble update after 5 seconds
var _lastPlayerSelected = null; // to be able to clear the right player update (timeoutBubble)

// Bubble class
// This class represents the container for players' profil
var Bubble = React.createClass({
    // Class' Properties
    getDefaultProps : function () {
        return {
            index : -1,
            player: null,
            EventClearTotal : null
        };
    },

    // The visual implementation
    render: function () {
        return  (<div className="player" data-player={this.props.player.name} data-index={this.props.index}>
                        <div className="player-profil">
                            <div className="player-profil-img"></div>
                            <div className="player-profil-clear" data-index={this.props.index} onTouchTap={this.clearTaxes}>clear</div>
                        </div>
                        <span className="player-name">{this.props.player.name}</span>
                        <span className="player-taxes">{this.props.player.total}</span>
                    </div>);
    },

    // Reset one player's taxes
    clearTaxes : function (event) {
        // Fire the method of the main class (counters) to save data on the server
        this.props.EventClearTotal(event, this);
    },

});

// BottomBar class
// This class is used to create visual profil for players
var BottomBar = React.createClass({
    // Class' Properties
    getDefaultProps : function () {
        return {
            players : [],
            taxesValue : 0,
            newPlayer : "",
            EventClearTotal : null
        };
    },

    // The visual implementation
    render : function () {
        return (
            <div id="footer">
                <div className="bottom-bar">
                    <div className="bottom-bar-action bottom-bar-action-displayed">
                        <FlatButton className="button" label="Add player" onTouchTap={this._toggleAddPlayer} />
                        <FlatButton className="button" label="Edit taxes" onTouchTap={this._toggleEditTaxes} />

                        <div className="bottom-bar-players">
                            <div className="players">
                                {this.props.players.map(function (player, i) {
                                    return  <Bubble key={i} player={player} index={i} EventClearTotal={this.props.EventClearTotal} />;
                                }.bind(this))}
                            </div>
                        </div>
                    </div>



                    <div className="addPlayerTextField addPlayerTextField-hidden">
                        <TextField
                            className="addPlayerTextFieldValue"
                            hintText="Player's name"
                            floatingLabelText="Add a player to the game"
                            onChange={this._handlePlayerInputChange}
                        />

                      <FlatButton className="button" primary={true} label="Save player" onTouchTap={this._addPlayer} />
                      <FlatButton className="button" label="Cancel" onTouchTap={this._cancelPlayer} />
                    </div>

                    <div className="editTaxesTextField editTaxesTextField-hidden">
                        <TextField
                            className="editTaxesTextFieldValue"
                            hintText="Taxes' value"
                            floatingLabelText="Edit taxes' value"
                            onChange={this._handleTaxesInputChange}
                        />

                    <FlatButton className="button" primary={true} label="Save taxes" onTouchTap={this._saveTaxes} />
                        <FlatButton className="button" label="Cancel" onTouchTap={this._toggleEditTaxes} />
                    </div>


                    <Snackbar
                        ref="snack"
                        message="Player added successfully!"
                        action="okay"
                        onActionTouchTap={this._dismiss}/>
                </div>
            </div>
        );
    },

    // Show/Hide the input to add a player
    _toggleAddPlayer : function () {
        // True if the bottom-bar-action is displayed; else False
        var toggled = document.querySelector(".bottom-bar-action-displayed") ? true : false;

        // Get visual elements
        var bottom          = document.querySelector(".bottom-bar");
        var addPlayer       = document.querySelector(".addPlayerTextField");
        var bottomAction    = document.querySelector(".bottom-bar-action");

        if (toggled) {
            // bottom-bar-action
            // -----------------
            // Remove the 'displayed' class if it's activated
            bottomAction.className = bottomAction.className.replace("bottom-bar-action-displayed", "");
            // Add the 'hidden' class
            bottomAction.className = bottomAction.className + " bottom-bar-action-hidden";

            // addPlayerTextField
            // ------------------
            // Remove the 'displayed' class if it's activated
            addPlayer.className = addPlayer.className.replace("addPlayerTextField-hidden", "");
            // Add the 'hidden' class
            addPlayer.className = addPlayer.className + " addPlayerTextField-displayed";

            // Change background color of the bottom
            bottom.style.background = "#eee";

        } else {
            // bottom-bar-action
            // -----------------
            // Remove the 'displayed' class if it's activated
            bottomAction.className = bottomAction.className.replace("bottom-bar-action-hidden", "");
            // Add the 'hidden' class
            bottomAction.className = bottomAction.className + " bottom-bar-action-displayed";

            // addPlayerTextField
            // ------------------
            // Remove the 'displayed' class if it's activated
            addPlayer.className = addPlayer.className.replace("addPlayerTextField-displayed", "");
            // Add the 'hidden' class
            addPlayer.className = addPlayer.className + " addPlayerTextField-hidden";

            // Change background color of the bottom
            bottom.style.background = "#2980B9";
        }
    },

    // Add a new player and save it to the server
    _addPlayer : function () {
        // Get the value from properties
        var playerName = this.props.newPlayer;

        // 1-Save the player in the json document
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://www.sideffects.fr/counters/add?name='+ playerName, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(null);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                this.refs.snack.show();
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {

            }
        }.bind(this);

        // 2-Reload the table with new data


        this._toggleAddPlayer();
    },

    // Show/Hide the input to edit taxes
    _toggleEditTaxes : function () {
        // True if the bottom-bar-action is displayed; else False
        var toggled = document.querySelector(".bottom-bar-action-displayed") ? true : false;

        // Get visual elements
        var bottom          = document.querySelector(".bottom-bar");
        var editTaxes       = document.querySelector(".editTaxesTextField");
        var bottomAction    = document.querySelector(".bottom-bar-action");

        if (toggled) {
            // bottom-bar-action
            // -----------------
            // Remove the 'displayed' class if it's activated
            bottomAction.className = bottomAction.className.replace("bottom-bar-action-displayed", "");
            // Add the 'hidden' class
            bottomAction.className = bottomAction.className + " bottom-bar-action-hidden";

            // editTaxesTextField
            // ------------------
            // Remove the 'displayed' class if it's activated
            editTaxes.className = editTaxes.className.replace("editTaxesTextField-hidden", "");
            // Add the 'hidden' class
            editTaxes.className = editTaxes.className + " editTaxesTextField-displayed";

            // Change background color of the bottom
            bottom.style.background = "#eee";

        } else {
            // bottom-bar-action
            // -----------------
            // Remove the 'displayed' class if it's activated
            bottomAction.className = bottomAction.className.replace("bottom-bar-action-hidden", "");
            // Add the 'hidden' class
            bottomAction.className = bottomAction.className + " bottom-bar-action-displayed";

            // editTaxesTextField
            // ------------------
            // Remove the 'displayed' class if it's activated
            editTaxes.className = editTaxes.className.replace("editTaxesTextField-displayed", "");
            // Add the 'hidden' class
            editTaxes.className = editTaxes.className + " editTaxesTextField-hidden";

            // Change background color of the bottom
            bottom.style.background = "#2980B9";
        }
    },

    // Save the new taxes value in the data table
    _saveTaxes : function () {
        // Get the value from properties
        var value = this.props.taxesValue;
        value = parseInt(value);

        // Apply the new value to the table
        var columns = document.querySelectorAll("td[label='taxes']");
        for (var i = 0; i < columns.length; i++) {
            columns[i].innerHTML = value;
        }

        this._toggleEditTaxes();
    },

    // Hide the input to add a player
    _cancelPlayer : function () {
        this._toggleAddPlayer();
    },

    // Hide the input to edit taxes
    _cancelTaxes : function () {
        this._toggleEditTaxes();
    },

    // Watch taxes' input changes
    _handleTaxesInputChange : function () {
        this.props.taxesValue = parseInt(event.target.value);
        // console.log("taxes changed : " + this.props.taxesValue);
    },

    // Watch player's input changes
    _handlePlayerInputChange : function () {
        this.props.newPlayer = event.target.value;
        // console.log("player changed : " + this.props.newPlayer);
    },

    // Dismiss the snack bar
    _dismiss : function () {
        this.refs.snack.dismiss();
    }
});


// Couters class
// This is the main class of the application
var Counters = React.createClass({
    // Define default props of the react element
    getDefaultProps : function () {
        return {
            playersCopy : [],
            indexSelected : -1,
            playerSelected : null,
            pointerAutoUpdate : null
        };
    },

    // Executes exactly once during the lifecycle
    // of the component and sets up the initial state of the component.
    getInitialState : function () {
        // return states;
        return  { players: [] };
    },

    // Called automatically by React when a component is rendered.
    componentDidMount : function () {
        this._loadData();

        this._startAutoUpdate();
    },

    // Polling the data from a server
    _startAutoUpdate : function () {
        // Update the ui every 10sec
        this.pointerAutoUpdate = window.setInterval(this._loadData, 5000);
    },

    // Stop fetching data from the server
    _stoptAutoUpdate : function () {
        window.clearInterval(this.pointerAutoUpdate);
    },

    // Render the component class
    render: function() {
        //Custom Actions
        var customActions = [
          <FlatButton
              key={0}
              label="Cancel"
              secondary={true}
              onTouchTap={this._handleDialogCancel} />,
          <FlatButton
              key={1}
              label="Sure"
              primary={true}
              onTouchTap={this._handleDialogSubmit} />
        ];

        return (
            /* Begin : CONTAINER */
            <div id="container">
                <div id="body">
                    <div className="main-container">
                        <h1>counters</h1>
                        <RaisedButton className="reset-button" label="reset" onTouchTap={this.reset} />

                        {/* Begin : TABLE */}
                        <Table className="counters-tab" >
                            {this.state.players.map(function (player, i) {
                                return  (<Tr key={i} data-playername={player.name} data-index={i}
                                            data={{ name: player.name, points: player.points,
                                                    taxes: player.taxes, total: 0}}
                                                    onTouchTap={this.rowTouched} />);
                            }.bind(this))}
                        </Table> {/* End : TABLE */}

                        {/* Begin : CONTROLS */}
                        <div className="counters-controls">
                            <FloatingActionButton className="counters-controls-button" mini={false} onTouchTap={this.increment} >
                                <img className="icon icons8-Cancel"
                                    src="./assets/up-50.png" width="20" height="20"/>
                            </FloatingActionButton>

                            <FloatingActionButton className="counters-controls-button" mini={false} onTouchTap={this.decrement} >
                                <img className="icon icons8-Cancel"
                                    src="./assets/down-50.png" width="20" height="20"/>
                            </FloatingActionButton>

                            <FloatingActionButton className="counters-controls-button" mini={false} onTouchTap={this._deletePlayer} >
                                <img className="icon icons8-Cancel"
                                    src="./assets/cancel-50.png" width="20" height="20"/>
                            </FloatingActionButton>
                        </div> {/* End : CONTROLS */}

                        {/* DIALOG */}
                        <Dialog
                         ref="dialog"
                         title="Reset Data"
                         actions={customActions}>
                         Are you sure you want to reset all the data?
                       </Dialog>

                       <Snackbar
                           ref="snackDeletedSuccess"
                           message="Player deleted successfully!"
                           action="okay"
                           onActionTouchTap={this._dismiss}/>


                      <Snackbar
                          ref="snackDataSuccess"
                          message="Data saved successfully!"
                          action="okay"
                          onActionTouchTap={this._dismiss}/>

                      <Snackbar
                          ref="snackDataFail"
                          message="Sorry, there was a problem saving your changes :("
                          action="okay"
                          onActionTouchTap={this._dismiss}/>

                    </div> {/* End : CONTAINER */}
                </div> {/* End : BODY */}

                <BottomBar players={this.state.players} EventClearTotal={this._playerPayed} />
            </div>
        );
    },

    // Event fired when a row (Tr) is clicked
    rowTouched : function (event) {
        // Get the row clicked
        var parent = event.target.parentNode;

        // Get the previous active row (if there was one)
        var previousSelectedRow = document.querySelector("tr[selected='true']");

        if (previousSelectedRow !== null) {
            // If there's already a row selected
            // Compare if it's the same row
            if (parent === previousSelectedRow) {
                // If it is the same, deselect it
                parent.setAttribute("selected", "false");
                this.hideControls();
            }
            else {
                // If not, select the row
                // Set an attribute to say that it is this row which was clicked
                previousSelectedRow.setAttribute("selected", "false");
                parent.setAttribute("selected", "true");
                this.activateControls();

                // Set the active user
                this.props.playerSelected = parent.getAttribute("data-playername");
                this.props.indexSelected = parent.getAttribute("data-index");
                // console.log(this.props.playerSelected);
                // console.log(this.props.indexSelected);
            }
        }
        else {
            // If there's no row selected,
            // Select the row clicked ->
            // Set an attribute to say that it is this row which was clicked
            parent.setAttribute("selected", "true");
            this.showControls();

            // Set the active user
            this.props.playerSelected = parent.getAttribute("data-playername");
            this.props.indexSelected = parent.getAttribute("data-index");
        }
    },

    // Animate IN the controls' buttons (show)
    showControls : function () {
        // Get the controls' buttons
        var controls = document.querySelector(".counters-controls");

        var delay = 0;                          // this is a delay for animation
        var children = controls.childNodes;     // get an array of buttons to hide them

        for (var i = children.length - 1; i >= 0 ; i--) {
            var child = children[i];
            delay += 100;

            // Add a delay to the animation and show the button
            window.setTimeout(function (child) {
                child.style.opacity = "1";
                child.style.top = "0px";
            }, delay, child);
        }
    },

    // Animate OUT the controls' buttons (hide)
    hideControls : function () {
        // Get the controls' buttons
        var controls = document.querySelector(".counters-controls");

        var delay    = 0;                       // this is a delay for animation
        var children = controls.childNodes;     // get an array of buttons to hide them

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            delay += 100;

            // Add a delay to the animation and hide the button
            window.setTimeout(function (child) {
                child.style.opacity = "0";
                child.style.top = "20px";
            }, delay, child);
        }
    },

    // Animate controls to show activation
    activateControls : function () {
        // Get the controls' buttons
        var controls = document.querySelector(".counters-controls");

        var delay = 0;                          // this is a delay for animation
        var children = controls.childNodes;     // get an array of buttons to hide them

        for (var i = children.length - 1; i >= 0 ; i--) {
            // Get the current item (control)
            var child = children[i];

            // Remove the classe that animate this control
            child.className = child.className.replace(" active-control", "");

            // Add time to the delay
            delay += 100;

            // Add a delay to the animation and show the button
            window.setTimeout(function (child) {
                child.className += " active-control";
            }, delay, child);
        }
    },

    // Inrement (+1) to the points of the selected row
    increment : function () {
        // Get the selected row
        var points = document.querySelector("tr[selected='true'] td[label='points']");

        if (points !== null) {
            // If a row is selected, add +1 to its points
            points.innerHTML = parseInt(points.innerHTML) + 1;
            this.updateTotal();
        }
    },

    // Decrement (-1) from the points of the selected row
    decrement : function () {
        // Get the selected row
        var points = document.querySelector("tr[selected='true'] td[label='points']");

        if (points !== null) {
            // If a row is selected, add +1 to its points
            points.innerHTML = parseInt(points.innerHTML) - 1;
            this.updateTotal();
        }
    },

    // Update total for the selected row according to taxes and points
    updateTotal : function () {
        // Get the html elements to get the values
        var points  = document.querySelector("tr[selected='true'] td[label='points']");
        var taxes   = document.querySelector("tr[selected='true'] td[label='taxes']");
        var total   = document.querySelector("tr[selected='true'] td[label='total']");
        var name    = document.querySelector("tr[selected='true'] td[label='name']").innerHTML;

        var index = this.props.indexSelected;

        // Clear the timeout if it hasn't been updated yet
        if (_lastPlayerSelected === name) {
            window.clearTimeout(_timeoutBubble);
        }

        // Update the total
        total.innerHTML = parseInt(points.innerHTML) * parseInt(taxes.innerHTML);

        // Save the last player
        _lastPlayerSelected = name;

        // Automatically update the player-card after a delay
        _timeoutBubble = window.setTimeout(function (index, name, points, total) {
            this._stoptAutoUpdate(); // avoid erasing the new value with server's update

            this.props.playersCopy = this.state.players;
            // var updated = this.state.players;
            // console.log(this.props.indexSelected);
            var prevTot = this.props.playersCopy[index].total;

            this.props.playersCopy[index].total = parseInt(prevTot) + parseInt(total.innerHTML);
            this.setState({players: this.props.playersCopy});

            this.updateBubble(name, points, total);
            this._saveData(); // persist data to the server
        }.bind(this), 3000, index, name, points, total);

    },

    // Update the player card with his/her total
    updateBubble : function (name, points, total) {
        // Get the player taxes
        // var playerTaxes = document.querySelector(".bottom-bar-players .player[data-player='"+ name +"'] .player-taxes");

        // Update the user's taxes
        // playerTaxes.innerHTML = parseInt(playerTaxes.innerHTML) + parseInt(total.innerHTML);

        // Set the player total & point to 0 (in the table)
        points.innerHTML = 0;
        total.innerHTML  = 0;
    },

    // Event to reset data
    reset: function(event) {
        // Stop the time
        this._stoptAutoUpdate();

        // Show the dialog
        this.refs.dialog.show();
    },

    // Event when a player payed his amount of cash
    _playerPayed : function (event, reactElement) {
        var index = reactElement.props.index;

        this.props.playersCopy = this.state.players;
        this.props.playersCopy[index].total = 0;

        // Update UI
        this.setState({players: this.props.playersCopy});

        // Save to the file
        this._saveData();
    },

    // Deny reset all data
    _handleDialogCancel: function() {
        this.refs.dialog.dismiss();
    },

    // Confirm reset all data
    _handleDialogSubmit: function() {
        // Reset data
        this.props.playersCopy = this.state.players;
        for (var i = 0; i < this.props.playersCopy.length; i++) {
            this.props.playersCopy[i].total = 0;
        }

        // Update UI
        this.setState({players: this.props.playersCopy});

        // Save to the file
        this._saveData();

        this.refs.dialog.dismiss();
    },

    // Get data from the server
    _loadData : function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://www.sideffects.fr/counters/load', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(null);

        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
              // If the request is OK
              var playersArray = [];

              // Data received from the server
              var response = xhr.response;
              response = JSON.parse(response);

              for (var p in response) {
                  var jsonPlayer = {};

                  jsonPlayer.name    = p;
                  jsonPlayer.points  = 0;
                  jsonPlayer.taxes   = response[p].taxes !== undefined ? response[p].taxes : 750;;
                  jsonPlayer.total   = response[p].total !== undefined ? response[p].total : 0;
                  playersArray.push(jsonPlayer);
              }

              // Fire the callback function
              this.setState({players: playersArray});
            //   console.log('updated ui!');
          }
          else if (xhr.readyState == 4 && xhr.status != 200) {
              // Something went wrong
              console.log("Something went wrong, please contact @jeremiecorpinot (twitter)" +
                            " or create a bug report on GitHub to report this problem.");
          }
        }.bind(this);
    },

    // Save data to the server
    _saveData: function () {
        //console.log(this.state.players);
        var array = this.state.players;
        var jsonObject = {};


        for (var i = 0; i < array.length; i++) {
            var jsonPlayer = {};

            jsonPlayer.name      = array[i].name;
            jsonPlayer.points    = array[i].points;
            jsonPlayer.taxes     = array[i].taxes;
            jsonPlayer.total     = array[i].total;
            jsonObject[array[i].name] = jsonPlayer;
        }

        jsonObject = JSON.stringify(jsonObject);
        jsonObject = encodeURIComponent(jsonObject);


        // Send an Ajax request to the server
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://www.sideffects.fr/counters/save?json=' + jsonObject, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(null);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
                 // console.log("Data correctly saved!");
                 this.refs.snackDataSuccess.show();
                 this._startAutoUpdate();
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {
                 // Notify to the user that an error happened
                 console.log("error");
                 console.log(xhr.status);

                 this.refs.snackDataFail.show();
            }
        }.bind(this);
    },

    // Delete a player and save the new information on the server
    _deletePlayer : function () {
        var playerToDelete = this.props.playerSelected;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://www.sideffects.fr/counters/delete?name='+ playerToDelete, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(null);

        xhr.onreadystatechange = function() {
           if (xhr.readyState == 4 && xhr.status == 200) {
               this.refs.snackDeletedSuccess.show();
           }
           else if (xhr.readyState == 4 && xhr.status != 200) {

           }
       }.bind(this);
   },

});


module.exports = Counters;
