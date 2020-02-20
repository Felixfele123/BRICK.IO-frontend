import axios from 'axios';


const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = 'http://localhost:3456/login'; // site that doesn’t send Access-Control-*
fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
.then(response => response.text())
.then(contents => console.log(contents))
.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

class UserService {

    static loginUser(userEmail){
        axios({
            method: 'post',
            url: url,
            data: {
              email: userEmail
            },
            withCredentials: true
          });
    }
}

export default UserService;