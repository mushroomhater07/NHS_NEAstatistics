// /^[a-zA-Z0-9]+$/;
// /.*/i
$( document ).ready(()=>{
    NBP.init("mostcommon_500", "/js", true);
    $("form").submit((e)=>{
        e.preventDefault();
        var username = $("input[name='username']").val().trim().replace(/_/g, "").substr(0,20).toLowerCase();
        var password = $("input[name='password']").val().trim();
        var email = $("input[name='email']").val().trim().toLowerCase();
        var usernameCheck = check(username);
        var passwordCheck = check(password);   
        // console.log(email.length );

        if (username.length == 0 || password.length 
            ==0 || email.length == 0){
                err("All fields are required");
            }else if(password.length < 8){
                err("Password must be at least 8 characters long");
            }else if(usernameCheck.unused == true){
                err("Username contains invalid characters");
            }else if(passwordCheck.lower == false || passwordCheck.upper == false || passwordCheck.number == false){
                err("Password must contain at least 1 uppercase, 1 lowercase, 1 number");
            }else if(password.includes("passw") || password.includes("1234")){
                err("Password is too common")
            }else
            {   
                $.post('/registerData', {'user': username, 'email':email, 'pass':password}, function(result) {
                })
            }
        }        )
    $("input").click(()=>{
        $(".form").css("background", "#0095c7");
        $("pre").css("visibility", "hidden");
    })
    $("input[type='text']").keyup(()=>{
        var text =$("input[type='text']").val().replace(/_/g, "").substr(0,20);
        var length = 20-text.length;
        if(length == 20){$("input[type='text']").val("")}
        else $("input[type='text']").val("_".repeat(length)+text)

    })

   function err(detail){
    $(".form").css("background", "red");
    $("pre").html(detail);
    $("pre").css("visibility", "visible");
}
function check(stringval){
    var islower= false,isUpper= false, isNumber= false,isSpace= false, isUnused = false;
    for (let index = 0; index < stringval.length; index++) {
    var char = stringval.charCodeAt(index);
    if(char >= 64 && char <= 90)
        {isUpper = true}
    else if(char >= 97 && char <= 122){
        islower = true}
    else if(char >= 48 && char <= 57){
        isNumber = true;}
    else if(char == 32){
        isSpace = true;}
    else{
        isUnused = true;
        }
    }
    return {"lower":islower , 
    "upper":isUpper ,
    "number": isNumber ,
    "space": isSpace ,
    "unused": isUnused};
}
})

