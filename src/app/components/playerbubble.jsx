var React       = require('react'),
    mui         = require('material-ui'),
    FlatButton  = mui.FlatButton,
    TextField   = mui.TextField,
    Snackbar    = mui.Snackbar;


var Bubble = React.createClass({
    getDefaultProps : function () {
        return {
            player: null
        }
    },
    render: function () {
        return  (<div className="player" data-player={this.props.player.name}>
                        <div className="player-profil">
                            <div className="player-profil-img"></div>
                            <div className="player-profil-clear" onTouchTap={this.clearTaxes}>clear</div>
                        </div>
                        <span className="player-name">{this.props.player.name}</span>
                        <span className="player-taxes">{this.props.player.total}</span>
                    </div>);
    },

    // Reset one player's taxes
    clearTaxes : function (event) {
        var taxes = event.target.parentNode.parentNode;
        taxes = taxes.lastElementChild;
        taxes.innerHTML = 0;
    },

});

var PlayerBubble = React.createClass({
    getDefaultProps : function () {
        return {
            players: [],
            taxesValue : 0,
            newPlayer: ""
        }
    },
    render : function () {
        return (
            <div className="bottom-bar">
                <div className="bottom-bar-action bottom-bar-action-displayed">
                    <FlatButton className="button" label="Add player" onTouchTap={this._toggleAddPlayer} />
                    <FlatButton className="button" label="Edit taxes" onTouchTap={this._toggleEditTaxes} />

                    <div className="bottom-bar-players">
                        <div className="players">
                            {this.props.players.map(function (player, i) {
                                return  <Bubble key={i} player={player} />;
                            })}
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
        );
    },

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

    _addPlayer : function () {
        // Get the value from properties
        var playerName = this.props.newPlayer;

        // 1-Save the player in the json document
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3001/counters/add?name='+ playerName, true);
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

    _ajaxAddPlayer : function () {

    },

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

    _cancelPlayer : function () {
        this._toggleAddPlayer();
    },

    _cancelTaxes : function () {
        this._toggleEditTaxes();
    },

    _handleTaxesInputChange : function () {
        this.props.taxesValue = parseInt(event.target.value);
    },

    _handlePlayerInputChange : function () {
        this.props.newPlayer = event.target.value;
    },

    _dismiss : function () {
        this.refs.snack.dismiss();
    }
});

module.exports = PlayerBubble;
