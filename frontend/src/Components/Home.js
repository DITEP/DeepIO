import React from "react";
import APIClient from '../Actions/apiClient';

import { withTranslation } from 'react-i18next';
import i18n from "i18next";

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
    };
	}
 
  async componentDidMount() {
    this.apiClient = new APIClient();  
  }

	render () {
    const { t } = this.props;
    return (
      <div className="container">
        <div className="container-fluid">
          <p>Welcome</p>
          <p>{t('home.explanation')}</p>
        </div>
      </div>
      );
    }
}

export default withTranslation()(Home);