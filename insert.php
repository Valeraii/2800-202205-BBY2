<?php
/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
 $link = mysqli_connect("localhost", "root", "", "demo");
// Check connection
if($link === false){
   die("ERROR: Could not connect. " . mysqli_connect_error());
}
// Escape user inputs for security
$first_name = mysqli_real_escape_string($link, $_POST['firstName']);
$last_name = mysqli_real_escape_string($link, $_POST['lastName']);
$email_address = mysqli_real_escape_string($link, $_POST['email']);
// attempt insert query execution
$sql = "INSERT INTO user (adminRights, email, pass, firstName, lastName) VALUES ('NO', '$email_address', '123', '$first_name', '$last_name')";
if(mysqli_query($link, $sql)){
   echo "Data successfully Saved.";
} else{
   echo "ERROR: Could not execute $sql. " . mysqli_error($link);
}
// close connection
mysqli_close($link);
?>