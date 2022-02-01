import React,{Component} from 'react'
import './styling/first.css'

export default class Domains extends Component {

    constructor(props) {
        super(props)
        this.update = this.update.bind(this)
       
        this.state = {
            name: [],
            done:0,
            timer:0
        }
    }

    //Fire sse - update() at fixed intervals - will also invoke a re-render
    componentDidMount() {
        
        this.interval = setInterval(() => this.update(), 64000)
        
    }

    //Clear any unmounted component data - to avoid memory leaks
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    //Start sse stream. Also includes logic to sort according to number of times domain edited and user'sedit count
    update() {
        const sse = new EventSource("https://stream.wikimedia.org/v2/stream/revision-create")
        var arr_main = []
        var arr_dom = []
        

        //On retrieval of sse stream
        sse.onmessage = (sse) => {
            var parsedData = JSON.parse(sse.data)

        
            var x = arr_dom.indexOf(parsedData.meta.domain)
           
            
            //If domain name already exists in array, increment the count else add to array
            if(x !== -1) {
                arr_main[x].count+=1
            } else {
                arr_main.push({name: parsedData.meta.domain, count: 1})
                arr_dom.push(parsedData.meta.domain)
                
            }
       
        
            // this.setState({ name: arr_main })
            
        } 
        //To set timer to close the connection after a fixed interval and on closing- sort the obtained array and set the states
        setTimeout(() => {sse.close();
            // let arr = this.state.name
            let arr = arr_main

            arr.sort((a,b)=>{
                return b.count- a.count
            })
        
            this.setState({
                name:arr
            })
            this.setState({done:1});
            var x = this.state.timer+1
            this.setState({timer: x})
        },60000)

        
    }
  

    

    render() {
        return(
        <div className='wiki'>
            
            <h2>Total number of domains updated: {this.state.name.length}</h2>
            {
                (this.state.done==1?
                    this.state.name.map(element=>{
                        return <p> {element.name} updated {element.count} no. of times&nbsp;&nbsp;&nbsp;&nbsp;Minute {(this.state.timer-1)} to {this.state.timer} report </p>
                    })
                :"loading...")
            }
        </div>
        
        )
    }
}