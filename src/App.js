import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';


const App = () => {

  const [counter, setCounter] = useState(0);
  const [randomUserData, setRandomUserData] = useState('');
  const [userInfos, setUserInfos] = useState([]);
  const [nextPageNumber, setNextPageNumber] = useState(0);

  const fetchRandomData = (pageNumber) => {
    return (
      axios.get(`https://randomuser.me/api?page=${pageNumber}`)
        .then(({data}) => {
          //handle success
          console.log(data);
          // return JSON.stringify(data, null, 2);
          return data;
        })
        .catch((error) => {
          //handle error
        console.error(error);
        })
    )
  }

  const getFullUserName = (userInfo) => {
    const {name: {first, last}} = userInfo;
    console.log('the info you wanted', first, last);
    return (
      `${first} ${last}`
      
    );
  }

  //how i would normally do it
  // const fetchNextUser = () => {
  //   fetchRandomData(nextPageNumber).then((randomData) => {
  //     setRandomUserData(JSON.stringify(randomData, null, 2) || 'No user data found.');
  //     if(randomData === undefined) return;
  //     const newUserInfos = [...userInfos, ...randomData.results]
  //     setUserInfos(newUserInfos);
  //     setNextPageNumber(randomData.info.page + 1);
  //   });
  // }

  //to get rid of the eslint catcher in the use effect
  const fetchNextUser = useRef(() => {});

  fetchNextUser.current = () => {
    fetchRandomData(nextPageNumber).then((randomData) => {
      setRandomUserData(JSON.stringify(randomData, null, 2) || 'No user data found.');
      if(randomData === undefined) return;
      const newUserInfos = [...userInfos, ...randomData.results]
      setUserInfos(newUserInfos);
      setNextPageNumber(randomData.info.page + 1);
    });
  }

  useEffect(() => {
    fetchNextUser.current();
    // fetchRandomData(nextPageNumber).then((randomData) => {
    //   setRandomUserData(JSON.stringify(randomData, null, 2) || 'No user data found.');
    //   setUserInfos(randomData.results);
    //   setNextPageNumber(randomData.info.page + 1);
    // });
  }, []);

  

  return (
    <div className='app'>
      <div className="counter">
        <p>Count: {counter}</p>
        <button onClick={() => {setCounter(counter + 1)}}>Increase Counter</button>
      </div>
      <p>*************************************************************************************************************</p>
      <div className='randomData'>
        <button className='randomBTN' onClick={() => {fetchRandomData()}}> Fetch Random User (console.log)</button>
        
        <p>*************************************************************************************************************</p>
          <div className='userMap'>
          {
            userInfos.map((userInfo, index) => (
              <div key={index}>
                <p><small>{getFullUserName(userInfo)}</small></p>
                <img src={userInfo.picture.thumbnail} alt={userInfo.name.last} />
              </div>
              
            ))
          }
          
          </div>
          <button onClick={() => {setNextPageNumber(fetchNextUser())}}>Fetch next User</button>
          <p>*************************************************************************************************************</p>
          <pre>{randomUserData}</pre>
        
      </div>
      
    </div>
  )
}

export default App;
