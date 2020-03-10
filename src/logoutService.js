import axios from 'axios';


const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = 'http://localhost:3456/logout'; // site that doesn’t send Access-Control-*
fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
.then(response => response.text())
.then(contents => console.log(contents))
.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))


class logoutService {
    
    static async logout(){
        axios({
            method: 'get',
            url: url,
            withCredentials: true
          });
          console.log("logged out")
    }
}

export default logoutService;