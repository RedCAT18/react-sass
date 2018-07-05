import React, { Component } from 'react';
import moment from 'moment';
import ViewerTemplate from './components/ViewerTemplate';
import SpaceNavigator from './components/SpaceNavigator';
import Viewer from './components/Viewer';

import * as api from './lib/api';

class App extends Component {
  state = {
    loading: false,
    maxDate: null,
    date: null,
    url: null,
    mediaType: null
  };

  _getAPOD = async date => {
    if (this.state.loading) return; //이미 요청중이면 무시

    //로딩 시작
    this.setState({ loading: true });

    try {
      const response = await api.getAPOD(date);
      //비 구조화 할당 + 새로운 이름
      const { date: retrievedDate, url, media_type: mediaType } = response.data;

      if (!this.state.maxDate) {
        //만일 maxDate값이 없으면 새로 지정
        //오늘 이후의 데이터는 아직 없으므로 오늘이 가장 마지막 날짜
        this.setState({ maxDate: retrievedDate });
      }

      //서버로부터 받은 데이터 넣기
      this.setState({
        date: retrievedDate,
        mediaType,
        url
      });
    } catch (e) {
      console.log(e);
    }

    //로딩 종료
    this.setState({ loading: false });
  };

  //페이지 넘기기
  _handlePrev = () => {
    const { date } = this.state;
    const prevDate = moment(date)
      .subtract(1, 'days')
      .format('YYYY-MM-DD');
    console.log(prevDate);
    this._getAPOD(prevDate);
  };

  _handleNext = () => {
    const { date, maxDate } = this.state;
    if (date === maxDate) return; //오늘일 경우 더 이상 뒤로 갈 수 없다

    const nextDate = moment(date)
      .add(1, 'days')
      .format('YYYY-MM-DD');
    this._getAPOD(nextDate);
  };

  componentDidMount() {
    this._getAPOD();
  }

  render() {
    const { url, mediaType, loading } = this.state;
    const { _handlePrev, _handleNext } = this;
    return (
      <ViewerTemplate
        spaceNavigator={
          <SpaceNavigator onPrev={_handlePrev} onNext={_handleNext} />
        }
        viewer={<Viewer url={url} mediaType={mediaType} loading={loading} />}
      />
    );
  }
}

export default App;
