class Item {
    message = "";
    user_id = 0;
    is_admin = false;
    token = 0;
  }
export async function AuthCheck() {
if(sessionStorage.getItem("token") === null) {
    return false;
  }
  try {
    //const response = await fetch("./db.json");
    var item = new Item();
    item.message ="";
    item.user_id = sessionStorage.getItem("user_id");
    item.is_admin = sessionStorage.getItem("is_admin");
    item.token = sessionStorage.getItem("token");
    var url = new URL("http://fastapi.localhost:8008/token/");
    url.searchParams.append('user_id', item.user_id);
    url.searchParams.append('token', item.token);
    const response = await fetch(url, {method: "POST"});
    const result = await response.json();
    console.log(response.status)
    if (result.token!=item.token){
        return false;
    }
    if (response.status === 401) {
      return false;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return false;
  }
  return true;
}