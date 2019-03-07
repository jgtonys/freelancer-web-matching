import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as service from '../services/post';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';


class Test extends Component {
  constructor(props) {
    super(props);
    this.getTable = this.getTable.bind(this);
    this.state = {
      postId: 1,
      fetching: false,
      post: {
        title: null,
        body: null
      },
      comments: [],
      tableData: [{
        id: 'null',
        name: 'null',
        password: 'null',
        permission: 'null',
        created_at: 'null',
        updated_at: 'null'
      }],
      loading: false
    };
  }


  fecthPostInfo = async (postId) => {
    this.setState({
      fetching: true
    })
    const info = await Promise.all([
      service.getPost(postId),
      service.getComments(postId)
    ]);
    const {title, body} = info[0].data;
    const comments = info[1].data;
    this.setState({
      postId,
      post: {
        title,
        body
      },
      comments,
      fetching: false
    })
    console.log(info);
  }

  /*handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    console.log(event.target.value);
  };*/

  /*shouldComponentUpdate(nextProps) {
    const differentTable = this.props.tableData !== nextProps.tableData;
    return differentTable;
  }*/

  addUser = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    service.addUser(data);
  }

  getTable = async () => {
    this.setState({
      loading: true,
    })
    const d = await service.getTable().then(r => {
      return r.data;
    })
    .catch(e => {
      alert(e.response.data.message);
      return [];
    });

    this.setState({
      tableData: d,
    });
    //console.log(d);
    console.log(this.state.tableData);
    this.setState({
      loading: false,
    })
  }

  render() {
    const {postId,fetching,post,comments} = this.state;
    return (
        <div>
            <div className="p-3">
              <h2>Database frontend ReactJs</h2>
              <h3>React Routing Axios Test</h3>
            </div>
            <div className="p-3">
              <Form onSubmit={this.addUser} inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="id" className="mr-sm-2">ID</Label>
                  <Input type="text" name="id" id="inputId" placeholder="user id" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="password" className="mr-sm-2">Password</Label>
                  <Input type="password" name="password" id="inputPassword" placeholder="user password" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="name" className="mr-sm-2">Name</Label>
                  <Input type="text" name="name" id="inputName" placeholder="user name" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="permission" className="mr-sm-2">Permission</Label>
                  <Input type="select" name="permission" id="inputPermission">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </Input>
                </FormGroup>
                <Button type="submit">Add User</Button>
              </Form>
            </div>
            <div className="p-3">
              <Button onClick={this.getTable}>Refresh Table</Button>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>PASSWORD(CRYPTED)</th>
                    <th>NAME</th>
                    <th>PERMISSION</th>
                    <th>CREATED_AT</th>
                    <th>UPDATED_AT</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.tableData.map((row, i) => {
                  return (
                    <TableRow data={row} key={i} />
                  );
                })}
                </tbody>
              </Table>
            </div>
        </div>
    );
  }

};

class TableRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.data.id}</td>
        <td>{this.props.data.password}</td>
        <td>{this.props.data.name}</td>
        <td>{this.props.data.permission}</td>
        <td>{this.props.data.created_at}</td>
        <td>{this.props.data.updated_at}</td>
      </tr>
    )
  }
}


export default Test;
