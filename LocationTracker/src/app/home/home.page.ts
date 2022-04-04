import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  locations;

  constructor(private geolocation: Geolocation) {
    //instantiating the bucket holding all locations
    this.locations = []

   }

  async getLocation() {
    var output = await this.geolocation.getCurrentPosition({
      maximumAge: 1,
      timeout: 5000,
      enableHighAccuracy: true

    })

    console.log(output)
    const longLatTime = {long: output.coords.longitude, lat: output.coords.latitude, time: output.timestamp}
    this.locations.push(longLatTime)
    await this.setData()
  }

  async ngOnInit(){
    await this.getData()
    await this.getLocation()
  }

  async setData(){
    //sets the datas name to 'loc'
    await Storage.set({key: 'loc', value: JSON.stringify(this.locations)})

  }

  async getData(){
    var {value} = await Storage.get({key: 'loc'})
    if (value){
      this.locations = JSON.parse(value)
    }
    else{
      this.locations = []
    }
  }

  async delete(timestamp){

    this.locations = this.locations.filter(element => element.time != timestamp)
    await this.setData()

  }

}


