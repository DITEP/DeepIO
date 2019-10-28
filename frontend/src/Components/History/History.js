import React from "react";
import {withRouter} from 'react-router';
import './History.css';
import APIClient from '../../Actions/apiClient';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';

import i18n from "i18next";

class History extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      isFetchingData: true,
      profile: {}
    }
  }

  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getAuth().then((data) => {
      this.apiClient.getUserDetails(data.logged_in_as.email).then((data) => {
        this.setState({
          isFetchingData: false,
          profile: data
        })
      })
    }).catch((err) => { 
  		if (err.response.status) {
        if (err.response.status === 401) {
    			const location = { 
    				pathname: '/login', 
    				state: { 
    					from: 'History', 
    					message: i18n.t('messages.notauthorized') 
    				} 
    			} 
    			this.props.history.push(location) 
   		  }
      } 
		})  
	}

  createItems(item) {
    function convertTime(time) {
      let date = new Date(time.$date*1000);
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      return (hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
    }

    let startTime = new Date(item.timeStarted.$date);
    let endTime = new Date(item.timeEnded.$date);

    return (    
      <Row key={item._id}>
        <Col sm={4}>   
          <ListGroup.Item action eventKey={item._id}>
            {item.jobName}
          </ListGroup.Item>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            <Tab.Pane eventKey={item._id}>
              <Table striped bordered hover className="prediction-info">
                <tbody>
                  <tr>
                    <td> Prediction started: </td> 
                    <td> {startTime.toLocaleTimeString() + ' ' + startTime.toLocaleDateString()} </td>
                  </tr>
                  <tr>
                    <td> Prediction finished: </td> 
                    <td> {endTime.toLocaleTimeString() + ' ' + endTime.toLocaleDateString()} </td>
                  </tr>
                  <tr>
                    <td> Result: </td> 
                    <td> {item.result} </td>
                  </tr>
                </tbody>
              </Table>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    )
  }

  render() {
    if (!this.state.isFetchingData) {
      var historyEntries = this.state.profile.submittedJobs;
      var listItems = historyEntries.map(this.createItems);
    }
    return (
      <div className="container">
        <div className="container-fluid">
        
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="explanation">
          
            <Row key="Explanation">
              <Col sm={4}>   
                <ListGroup.Item action eventKey="explanation">
                  Explanation
                </ListGroup.Item>
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="explanation">
                    The tabs on the left side of the screen are the names of all the predictions that you have started so far. 
                    Click on the nams to get moe information about them!
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          
          
            {listItems}
          </Tab.Container>
        
        </div>
      </div>
    )
  }
}
export default withRouter(History);