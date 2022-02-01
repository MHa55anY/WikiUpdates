import React,{Component} from 'react'
import './styling/second.css'



export default class Users extends Component {

    constructor(props) {
        super(props)
        this.update = this.update.bind(this)
        this.state = {
            name: [],
            done:0,
            timer: 0
        }
    }

    componentDidMount() {
        
        this.interval = setInterval(() => this.update(), 64000)

        
        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update() {
        const sse = new EventSource("https://stream.wikimedia.org/v2/stream/revision-create")
        var arr_main = []
        var arr_usr = []
        

        sse.onmessage = (sse) => {
            var parsedData = JSON.parse(sse.data)

        
            var x = arr_usr.indexOf(parsedData.performer.user_text)
           
            if( parsedData.meta.domain == "en.wikipedia.org" ){

                //If user exists update their existing count
                if(x !== -1) {
                    arr_main[x].count = parsedData.performer.user_edit_count
                } else {
                    //We don't want bots!
                    if (parsedData.performer.user_is_bot == false){
                        arr_main.push({name: parsedData.performer.user_text, count: parsedData.performer.user_edit_count})
                        arr_usr.push(parsedData.performer.user_text)
                    }
                }
            }
        
            // this.setState({ name: arr_main })
            
        } 

        //set timeout and sort by count
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
        <div className='user'>
            <h2>Users who made changes to en.wikipidea.org</h2>
            {   
                (this.state.done==1?
                    this.state.name.map(element=>{
                        return <p> {element.name}: {element.count}&nbsp;&nbsp;&nbsp;&nbsp;Minute {(this.state.timer-1)} to {this.state.timer} report </p>
                    })
                :"loading...")
            }
        </div>
        
        )
    }
}