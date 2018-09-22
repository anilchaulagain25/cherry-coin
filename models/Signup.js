class Signup {
    constructor(publicKey, privateKey, unapprovedBalance, approvedBalancce, username, pwd) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.unapprovedBalance = unapprovedBalance;
        this.approvedBalancce = approvedBalancce;
        this.username = username;
        this.pwd = pwd;
    }
}
module.exports = Signup;