import axios from 'axios';


const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = 'http://localhost:3456/confirmation'; // site that doesn’t send Access-Control-*
fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
.then(response => response.text())
.then(contents => console.log(contents))
.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))


class ConfService {
    
    static async confirmCode(confirmcode){
        const res = await axios({
            method: 'post',
            url: url,
            data: {
              code: confirmcode
            },
            withCredentials: true
          });
          console.log(res.data[0]);
         localStorage.email = res.data[0].email;
         localStorage.level = res.data[0].level;
         localStorage.rank = res.data[0].rank;
    }
    static userdata(){

    }
}

export default ConfService;