import React, { useState, useEffect } from 'react'

import { apiTweetCreate, apiTweetList, apiTweetAction } from './lookup'

export function TweetComponent(props) {

    const textAreaRef = React.createRef()


    const [newTweets, setNewTweets] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(event)
        const newVal = textAreaRef.current.value
        let tempNewTweets = [...newTweets]

        apiTweetCreate(newVal, (response, status) => {
            console.log(response, status)
            if (status === 201) {
                tempNewTweets.unshift(response)
                setNewTweets(tempNewTweets)

            } else {
                console.log(response)
                alert('an error ocured please try again')
            }
        })

        textAreaRef.current.value = ''
    }

    return (
        <div className={props.className}>
            <div className='col-10 mt-5 mx-auto'>
                <h2 className='mb-3 mx-auto' >Just Tweet Your thoughts</h2>
                <form onSubmit={handleSubmit}>
                    <textarea placeholder='type your tweet here' ref={textAreaRef} required={true} className='form-control' name='tweet'>

                    </textarea>
                    <button type='submit' className='btn btn-primary mt-3' my-3>Tweet</button>
                </form>
            </div >
            <TweetList newTweets={newTweets} />
        </div >
    )

}

export function TweetList(props) {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [tweetsDidSet, setTweetsDidSet] = useState(false)

    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit)
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweets, tweetsInit])

    useEffect(() => {
        if (tweetsDidSet === false) {
            const myCallback = (response, status) => {
                console.log(response, status)
                if (status === 200) {
                    setTweetsInit(response)
                    setTweetsDidSet(true)
                }
                else {
                    alert("there is an error")
                }
            }

            apiTweetList(myCallback)
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet])

    const handleDidRetweet = (newTweet) => {
        const updateTweetsInit = [...tweetsInit]
        updateTweetsInit.unshift(newTweet)
        setTweetsInit(updateTweetsInit)

        const updateFinalTweets = [...tweets]
        updateFinalTweets.unshift(newTweet)
        setTweets(updateFinalTweets)
    }

    return <div className='pl-3 col-10 mx-auto'>
        {tweets.map((item, index) => {
            return <Tweet tweet={item}
                didRetweet={handleDidRetweet}
                className='my-3 pl-3 py-3 border bg-white text-dark'
                key={`${index}-{item.id}`} />
        })}
    </div>

}


export function ActionBtn(props) {
    const { tweet, action, didPerformAction } = props
    const likes = tweet.likes ? tweet.likes : 0
    const className = props.className ? props.className : 'btn btn-success btn-small mx-2'
    const actionDisplay = action.display ? action.display : "Action"


    const handleActionBackendEvent = (response, status) => {
        console.log(response, status)
        if ((status === 200 || status === 201) && didPerformAction) {
            didPerformAction(response, status)
        }

    }

    const handleClick = (event) => {
        event.preventDefault()
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    }

    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return < button className={className} onClick={handleClick} > {display}</button >
}

export function ParentTweet(props) {
    const { tweet } = props
    return tweet.parent ? <div className='row mb-3'>
        <div className='col-11 mx-auto p-3 border rounded'>
            <p className='mb-0 text-muted small'>Retweet</p>
            <Tweet hideActions className={'medium'} tweet={tweet.parent} />
        </div>
    </div> : null
}

export function Tweet(props) {
    const { tweet, didRetweet, hideActions } = props
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null)
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'


    const handlePerformAction = (newActionTweet, status) => {
        if (status === 200) {
            setActionTweet(newActionTweet)
        } else if (status === 201) {
            if (didRetweet) {
                didRetweet(newActionTweet)
            }
        }
    }

    return (
        <div className={className}>
            <div>
                <p>{tweet.id} - {tweet.content}</p>
                <ParentTweet tweet={tweet} />
            </div>
            {(actionTweet && hideActions !== true) && <div className='btn btn-group'>
                <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} className={'btn btn-primary btn-small mx-2'} action={{ type: "like", display: "Likes" }} />
                <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} className={'btn btn-info btn-small mx-2'} action={{ type: "unlike", display: "Unlikes" }} />
                <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} className={'btn btn-warning btn-small mx-2'} action={{ type: "retweet", display: "Retweet" }} />
            </div>
            }
        </div >)
} 