import axios from 'axios';

export function getPost(postId) {
    return axios.get('https://jsonplaceholder.typicode.com/posts/' + postId)
}

export function getComments(postId) {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
}

export function addUser(bodyFormData) {
    let jsonData = {};
    if(bodyFormData[1] == 2) {
      jsonData = {
        user_id: bodyFormData[0].get('userId'),
        password: bodyFormData[0].get('userPassword'),
        name: bodyFormData[0].get('userName'),
        portfolio: bodyFormData[0].get('userPortfolio').name,
        major : bodyFormData[0].get('userMajor'),
        photo : bodyFormData[0].get('userPhoto').name,
        userType : bodyFormData[1],
        phone: bodyFormData[2],
        career: bodyFormData[3],
        age: bodyFormData[4],
        language: bodyFormData[5],
        score: bodyFormData[6],
      }
    }
    else {
      jsonData = {
        user_id: bodyFormData[0].get('userId'),
        password: bodyFormData[0].get('userPassword'),
        name: bodyFormData[0].get('userName'),
        photo : bodyFormData[0].get('userPhoto').name,
        userType : bodyFormData[1],
        phone: bodyFormData[2],
      }
    }

    console.log(jsonData); // backend 에 보내는 body 데이터를 파싱한 것

    axios({
      method: 'post',
      url: '/signup',
      data: jsonData,
      config: { headers: { 'content-type': 'multipart/form-data' }}
    })
    .then(r => {
      window.location = "/";
      console.log(r);
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}

export function addRequest(bodyFormData) {
  const uid = window.sessionStorage.getItem('uid');
  let jsonData = {
    client_id: uid,
    title: bodyFormData[0].get('title'),
    money: bodyFormData[0].get('money'),
    career: bodyFormData[0].get('career'),
    people_min: bodyFormData[0].get('people_min'),
    people_max: bodyFormData[0].get('people_max'),
    start_date: bodyFormData[0].get('start_date'),
    end_date: bodyFormData[0].get('end_date'),
    spec: bodyFormData[0].get('spec').name,
    language: bodyFormData[1],
    score: bodyFormData[2],
  };

  console.log(jsonData);

  axios({
    method: 'post',
    url: '/addrequest',
    data: jsonData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    window.location = "/";
    console.log(r);
  })
  .catch(e => {
    alert(e.response.data.message);
  });

}

export function addTeam(bodyFormData) {
  const uid = window.sessionStorage.getItem('uid');
  let jsonData = {
    mgr_id: uid,
    name: bodyFormData[0].get('teamName'),
    photo: bodyFormData[0].get('teamPhoto'),
    uid: bodyFormData[1],
  };

  console.log(jsonData);

  axios({
    method: 'post',
    url: '/addteam',
    data: jsonData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    //window.location = "/";
    console.log(r);
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}

export function getFreelancerInfo(id) {
  let jsonData = {id : id};
    return axios({
      method: 'post',
      url: '/getfreelancerinfo',
      data: jsonData,
    })
}

export function getMyTeam(id) {
  let jsonData = {id : id};
    return axios({
      method: 'post',
      url: '/getmyteam',
      data: jsonData,
    })
}

export function userLogin(bodyFormData) {
    let jsonData = {
      user_id: bodyFormData.get('inputId'),
      password: bodyFormData.get('inputPassword'),
    }

    let userType = bodyFormData.get('userSelect');
    let urlData = null;
    if(userType == "ADMIN") urlData = '/adminLogin';
    else if(userType == "FREELANCER") urlData = '/freelancerLogin';
    else urlData = '/clientLogin';
    axios({
      method: 'post',
      url: urlData,
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}}
    })
    .then(r => {
      console.log(r);
      window.sessionStorage.setItem('uid',r.data.data.id);
      window.sessionStorage.setItem('user',r.data.data.user_id);
      window.sessionStorage.setItem('userType',userType);
      window.sessionStorage.setItem('userToken',r.data.token);
      window.location = "/";
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}

export function userLogout() {
  window.sessionStorage.clear(); // .removeItem('user')
  window.location = "/";
}

export function getTable() {
    return axios({
      method: 'get',
      url: '/getall',
      //headers: { Authorization: window.sessionStorage.getItem('userToken') }
    })
}

export function getRequestTable(uid) {
  let jsonData = {
    uid: uid,
  }
    return axios({
      method: 'post',
      url: '/getallrequest',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
      //headers: { Authorization: window.sessionStorage.getItem('userToken') }
    })
}

export function deleteUser(id,type) {
  let jsonData = '';
  for(let i=0;i<id.length;i++) {
    let jsonData = {
      id : id[i],
      type : type[i],
    };
    axios({
      method: 'post',
      url: '/deleteuser',
      data: jsonData,
    })
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      alert(e.response.data.message);
    });
  }
}
