

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

var RNFS = require('react-native-fs');

export default class App extends Component {

  renderHello = () => {

    var path = RNFS.DocumentDirectoryPath + '/test22.txt';

    RNFS.writeFile(path, JSON.stringify('xyz'))
      .then((success) => {
        console.log('FILE WRITTEN!');

         this.readFile()
        
         //this.uploadFile(RNFS.DocumentDirectoryPath + '/test22.txt')

         
        //this.upload(RNFS.DocumentDirectoryPath + '/test22.json')
      })
      .catch((err) => {
        console.log(err.message);
      })

  }

  readFile = () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        console.log('GOT RESULT', result);

        // stat the first file
         console.log("the path is "+RNFS.stat(result[0].path))
        this.uploadFile(result[0].path)
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((statResult) => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then((contents) => {
        // log the file contents
        console.log(contents);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }


  uploadFiles(path) {

    // let formData = new FormData()
    // formData.append('file1', file)
    // fetch('http://knswin.cloudapp.net/Audire_Service/JsonFolder', {
    //   // content-type header should not be specified!
    //   method: 'POST',
    //   headers: { 
    //     'Accept': 'multipart/form-data',
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: formData,
    // })
    //   .then(response => response.json())
    //   .then(success => {
    //     console.log("suceessss")
    //   })
    //   .catch(error => console.log(error)
    //   );


    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://knswin.cloudapp.net/Audire_Service/JsonFolder');
    let formdata = new FormData();
    // add json file 
    formdata.append('files', { uri: path, name: 'test22', type: 'json' });
    xhr.send(formdata);
  }

  uploadFile = (path) => {

    console.log("path is",path)

    //path="http://www.w3.org/TR/PNG/iso_8859-1.txt";

    path="file://"+path;
    path = "C:\Users\KNS09087\Desktop\ab.jpg"
    var uploadUrl = 'http://knswin.cloudapp.net/Audire_Service/JsonFolder';

    var files = [
      {
        name: 'test22',
        filename: 'test22',
        filepath: path,
        filetype: 'img'
      }
    ];

    var uploadBegin = (response) => {
      var jobId = response.jobId;
      console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    var uploadProgress = (response) => {
      var percentage = Math.floor((response.totalBytesSent / response.totalBytesExpectedToSend) * 100);
      console.log('UPLOAD IS ' + percentage + '% DONE!');
    };


    RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: files,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      fields: {
        'hello': 'world',
      },
      begin: uploadBegin,
      progress: uploadProgress
    }).promise.then((response) => {
      if (response.statusCode == 200) {
        console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
      } else {
        console.log('SERVER ERROR');
      }
    })
      .catch((err) => {
        if (err.description === "cancelled") {
          // cancelled by user
        }
        console.log(err);
      });
  }


 upload = (file) => {
    fetch('http://knswin.cloudapp.net/Audire_Service/JsonFolder', { // Your POST endpoint
      method: 'POST',
      body: file // This is your file object
    }).then(
      response => response.json() // if the response is a JSON object
    ).then(
      success => console.log(success) // Handle the success response object
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  };
  

  render() {

    return (

      <View>
        <Text>Hello</Text>
        {this.renderHello()}
      </View >

    );
  }
}

