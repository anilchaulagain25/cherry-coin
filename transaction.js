const {remote} = require('electron');
const app = remote.app;
const $ = require('jquery');
const userTxnHlr = require('./src/UserTransactionHandler');
const txnHlr = require('./src/TransactionHandler');
const ko = require('knockout');


var resp = "";
var isEditMode = false;
var editTxnKey = "";

const txnModel = function(data){
	data = data || {};
	this.timestamp = data.timestamp || '';
	this.sender = data.sender || '';
	this.receiver = data.receiver || '';
	this.amount = data.amount || '';
	this.fee = data.fee || '';
	this.hash = data.hash || '';
	this.signature = this.signature || '';
}


$('#btnSend').on('click', ()=> {
	$('#divProgressBar').animate({"width": "100%"}, {"duration": 200, "easing": "linear"});
    var receiver = $('#txtReceiver').val();
    var amount = $('#txtAmount').val();
    var result = userTxnHlr.ValidateBeforeSave(receiver, amount);
    if (result.success) {
    	let txn = new txnModel();
    	txn.receiver = receiver;
    	txn.amount = amount;
    	txn.timestamp = isEditMode ? editTxnKey : Date.now();
    	userTxnHlr.SaveTransaction(txn);
    	clearTxnFields();
		refreshTables();
		$('#divProgressBar').css('width', '0%');
    } else {
    	alert(result.msg);
    }
});

var LoadTxnTable = () => {
	$('#tblPendingTxns').html('');
	txnHlr.GetTransactions().then((data)=>{
		for(let item of data){
			$('#tblPendingTxns').append(`<tr>
						<td>${item.value.sender}</td>
						<td>${item.value.receiver}</td>
						<td>${item.value.amount}</td>
						<td>${item.value.timestamp}</td>
						<td>
							<span class="badge badge-pill badge-success">Valid</span>
							<span class="badge badge-pill badge-info">Approved</span>
						</td>
					</tr>`);
						// <td>
						// 	<i class="material-icons" onclick="editTxn(${item.value.timestamp});"> edit </i>
						// 	<i class="material-icons" onclick="approveTxn(${item.value.timestamp});"> check </i>
						// 	<i class="material-icons" onclick="deleteTxn(${item.value.timestamp});"> delete_outline </i>
						// </td>
		}
	});
}

var LoadUserTxnTable = () => {
	$('#tblUserTxns').html('');
	userTxnHlr.GetTransactions().then((data)=>{
		for(let item of data){
			$('#tblUserTxns').append(`<tr>
						<td>${item.value.receiver}</td>
						<td>${item.value.amount}</td>
						<td>${item.value.timestamp}</td>
						<td><span class="badge badge-pill badge-warning">Pending</span></td>
						<td>
							<i class="material-icons" onclick="editTxn(${item.value.timestamp});"> edit </i>
							<i class="material-icons" onclick="approveTxn(${item.value.timestamp});"> check </i>
							<i class="material-icons" onclick="deleteTxn(${item.value.timestamp});"> delete_outline </i>
						</td>
					</tr>`);
		}
	});
}

var loadProgress =  () =>{
	for(let i = 0; i <= 100; i++){
		$('#divProgressBar').css('width', `${i}%`);
	};
};

var editTxn = (key) =>{
	userTxnHlr.GetTransaction(key).then((data)=> {
		editTxnKey = data.timestamp;
		isEditMode = true;
		$('#txtReceiver').val(data.receiver);
		$('#txtAmount').val(data.amount);
	});
};

var deleteTxn = (key) =>{
	userTxnHlr.DeleteTransaction(key);
	LoadUserTxnTable();
	refreshTables();
};


var approveTxn = (key) =>{
	console.log('Key: ', key);
	userTxnHlr.GetTransaction(key).then((data)=> {
		var txn = new txnModel(data);
		if(userTxnHlr.ValidateTransaction(txn)){
			console.log("verified")
			txn = userTxnHlr.GenerateTransactionSet(txn);
			console.log('descending for publish')
			console.log(txn)
			publishTxn(txn);
		}else{ console.log(false)}
	});
};

var publishTxn = (txn) => {
	userTxnHlr.ApproveTransaction(txn);
	refreshTables();
}

var clearTxnFields = () =>{
	$('#txtReceiver').val('');
	$('#txtAmount').val('');
    isEditMode = false; editTxnKey = "";
};

var refreshTables = () =>{
	LoadTxnTable();
	LoadUserTxnTable();
}

refreshTables();