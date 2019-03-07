import axios from 'axios';

export function getPost(postId) {
    return axios.get('https://jsonplaceholder.typicode.com/posts/' + postId)
}

export function getComments(postId) {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
}

export function addUser(bodyFormData) {
    axios({
      method: 'post',
      url: '/signup',
      data: bodyFormData,
      config: { headers: { 'content-type': 'multipart/form-data' }}
    })
    .then(r => {
      alert('회원가입이 완료되었습니다');
      window.location = "/";
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}


export function updateFreelancer(bodyFormData) {
    axios({
      method: 'post',
      url: '/updatefreelancer',
      data: bodyFormData,
      config: { headers: { 'content-type': 'multipart/form-data' }}
    })
    .then(r => {
      alert("사용자 정보가 수정되었습니다.");
      window.location = "/";
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}

export function updateClient(bodyFormData) {
  let jsonData = {
    cid: bodyFormData.get('cid'),
    userId: bodyFormData.get('userId'),
    userPassword: bodyFormData.get('userPassword'),
    userName: bodyFormData.get('userName'),
    userType: bodyFormData.get('userType'),
    phone: bodyFormData.get('phone'),
  };
    axios({
      method: 'post',
      url: '/updateclient',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
    .then(r => {
      alert("사용자 정보가 수정되었습니다.");
      window.location = "/";
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}

export function addStar(bodyFormData) {
  let score = bodyFormData[0];
  let request_id = bodyFormData[1];

  let jsonData = {
    score: score,
    request_id: request_id,
  };

  axios({
    method: 'post',
    url: '/addStar',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
  .then(r => {
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });

}


export function getTeamMgr(rid) {
  let jsonData = {
    rid: rid,
  };
  return axios({
    method: 'post',
    url: '/getteammgr',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
}

export function getClientBadgeMsg(uid) {
  let jsonData = {
    uid: uid,
  };
  return axios({
    method: 'post',
    url: '/getclientbadgemsg',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
}

export function getFreeBadgeMsg(uid) {
  let jsonData = {
    uid: uid,
  };
  return axios({
    method: 'post',
    url: '/getfreebadgemsg',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
}

export function requestComplete(bodyFormData) {
  axios({
    method: 'post',
    url: '/requestcomplete',
    data: bodyFormData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });

}

export function idVerify(id) {
  let jsonData = {
    user_id: id,
  };
  return axios({
    method: 'post',
    url: '/idverify',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
}

export function updatePortfolio(bodyFormData) {
    axios({
      method: 'post',
      url: '/updateportfolio',
      data: bodyFormData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
    .then(r => {
      window.location = "/";
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}

export function getMyExtPortfolio(uid) {
  let jsonData = {
    uid: uid,
  }
    return axios({
      method: 'post',
      url: '/getmyextportfolio',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
}


export function sendRejectMessage(d) {
  let jsonData = {
    message: d[0].get('Message'),
    rid: d[1],
    tid: d[2],
    uid: d[3],
  };
  axios({
    method: 'post',
    url: '/sendrejectmessage',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
  .then(r => {
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}






export function addRequest(bodyFormData) {
  axios({
    method: 'post',
    url: '/addrequest',
    data: bodyFormData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}

export function updateRequest(bodyFormData) {
  axios({
    method: 'post',
    url: '/updaterequest',
    data: bodyFormData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    alert("의뢰가 수정되었습니다.");
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}



export function addTeam(bodyFormData) {
  const uid = window.sessionStorage.getItem('uid');
  const mgr_uid = window.sessionStorage.getItem('user');
  let jsonData = {
    mgr_id: uid,
    name: bodyFormData[0].get('teamName'),
    photo: bodyFormData[0].get('teamPhoto'),
    uid: bodyFormData[1],
    mgr_uid: mgr_uid,
  };

  axios({
    method: 'post',
    url: '/addteam',
    data: jsonData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    alert("팀 생성이 완료되었습니다.");
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}


export function updateTeam(bodyFormData) {
  let jsonData = {
    team_id: bodyFormData.get('team_id'),
    members: bodyFormData.get('members'),
    name: bodyFormData.get('teamName'),
  };

  axios({
    method: 'post',
    url: '/updateteam',
    data: jsonData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    alert("팀이 업데이트 되었습니다");
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}

export function deleteTeam(id) {
  let jsonData = {
    team_id: id,
  };

  axios({
    method: 'post',
    url: '/deleteteam',
    data: jsonData,
    config: { headers: { 'content-type': 'multipart/form-data' }}
  })
  .then(r => {
    alert("팀이 삭제되었습니다.");
    window.location = "/";
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

export function sendApprovedMessage(d) {
  let jsonData = {
    rid: d[0],
    tid: d[1],
    uid: d[2],
  };
  axios({
    method: 'post',
    url: '/sendApprovedMessage',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
  .then(r => {
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
}


export function getClientInfo(id) {
  let jsonData = {id : id};
    return axios({
      method: 'post',
      url: '/getclientinfo',
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

export function getAllTeam() {
    return axios({
      method: 'get',
      url: '/getallteam',
    })
}


export function getTeamMessage(t) {
  let jsonData ={
    tid: t,
  }
    return axios({
      method: 'post',
      url: '/getteammessage',
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

export function addStarClient(bodyFormData) {
  let score = bodyFormData[0];
  let client_id = bodyFormData[1];
  let request_id = bodyFormData[2];
  let team_id = bodyFormData[3];

  let jsonData = {
    score: score,
    client_id: client_id,
    request_id: request_id,
    team_id: team_id,
  };

  axios({
    method: 'post',
    url: '/addStarClient',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}},
  })
  .then(r => {
    window.location = "/";
  })
  .catch(e => {
    alert(e.response.data.message);
  });
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
    })
}

export function getDecRequest() {
  return axios({
    method: 'get',
    url: '/getDecRequest',
  })
}

export function setRequestTeam(tid,rid) {
  let jsonData = {
    tid: tid,
    rid: rid,
  }
    axios({
      method: 'post',
      url: '/setrequestteam',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
    .then(r => {
      window.location = "/";
    })
    .catch(e => {
      alert(e.response.data.message);
    });
}


export function readClientMsg(uid) {
  let jsonData = {
    uid: uid,
  }
    return axios({
      method: 'post',
      url: '/readclientmsg',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
}

export function readFreelancerMsg(uid) {
  let jsonData = {
    uid: uid,
  }
    return axios({
      method: 'post',
      url: '/readfreelancermsg',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
}


export function getAllMessages(uid) {
  let jsonData = {
    uid: uid,
  }
    return axios({
      method: 'post',
      url: '/getallmessages',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
}

export function addIntPortfolio(d) {
  let jsonData = {
    rid: d[0],
    tid: d[1],
  }

  return axios({
    method: 'post',
    url: '/addIntPortfolio',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}}
  })
}


export function getRequestTeamTable(rid) {
  let jsonData = {
    rid: rid,
  }
    return axios({
      method: 'post',
      url: '/getallrequestteam',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
}


export function getTeamName(tid) {
  let jsonData = {
    tid: tid,
  }
    return axios({
      method: 'post',
      url: '/getteamname',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
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

    })
    .catch(e => {
      alert(e.response.data.message);
    });
  }
  alert('성공적으로 삭제되었습니다');
  window.location = "/";
}

export function deleteRequest(idArr) {
  for(let i=0;i<idArr.length;i++) {
    let jsonData = {
      id: idArr[i],
    }
    axios({
      method: 'post',
      url: '/deleterequest',
      data: jsonData,
    })
    .then(r => {

    })
    .catch(e => {
      alert(e.response.data.message);
    });
  }
  alert('성공적으로 삭제되었습니다');
  window.location = "/";
}








/* 석준 부분 추가 */
export function getRequestClient(uid, index) {
  let jsonData = {
    uid: uid,
    index: index,
  }
    return axios({
      method: 'post',
      url: '/getRequestClient',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
      //headers: { Authorization: window.sessionStorage.getItem('userToken') }
    })
}
export function getMyAvailableTeams(uid, rid, requirement, pmax, pmin, career) {
  let jsonData = {
    uid: uid,
    rid: rid,
    requirement,
    pmax: pmax,
    pmin: pmin,
    career: career,
  }

  return axios({
    method: 'post',
    url: '/getMyAvailableTeams',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}}
  })
}
export function applyTeamRequest(tid, rid) {
  let jsonData = {
    tid: tid,
    rid: rid,
  }

  return axios({
    method: 'post',
    url: '/applyTeamRequest',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}}
  })
}
export function getIntPortfolio(uid) {
  let jsonData = {
    uid: uid,
  }

  return axios({
    method: 'post',
    url: '/getIntPortfolio',
    data: jsonData,
    config: { headers: {'Content-Type': 'application/json'}}
  })
}

export function getTeamData(tid) {
  let jsonData = {
    tid: tid,
  }
    return axios({
      method: 'post',
      url: '/getTeamData',
      data: jsonData,
      config: { headers: {'Content-Type': 'application/json'}},
    })
}
