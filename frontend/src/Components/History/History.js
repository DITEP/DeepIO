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
import { withTranslation } from 'react-i18next';

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
  
  createTabs(item) {
    return (    
      <ListGroup.Item action eventKey={item._id}>
        {item.jobName}
      </ListGroup.Item>
    )
  }
  
  createCols(item) {
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
    )
  }

  render() {
    const { t } = this.props;
    
    if (!this.state.isFetchingData) {
      var historyEntries = this.state.profile.submittedJobs;
      
      var tabs = historyEntries.map(this.createTabs);
      var cols = historyEntries.map(this.createCols);
    }
    
    return (
      <div className="container">
        <div className="container-fluid">
        
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="explanation">
            <Row key="Explanation">
              <Col sm={4}>   
                <ListGroup.Item action eventKey="explanation">
                  {t('history.explanationtab')}
                </ListGroup.Item>
                {tabs}
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="explanation">
                    {t('history.explanationcontent')}
                  </Tab.Pane>
                  {cols}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        
        </div>
      </div>
    )
  }
}
export default withRouter(withTranslation()(History));