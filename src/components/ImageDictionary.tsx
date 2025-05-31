"use client";

import React, {useEffect, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {GenWords} from "@/tools/GenWord";
import Image from "next/image";
import {Button, IconButton, Typography} from "@mui/material";

const speak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
};

function PlayArrowIcon() {
    return null;
}

const ImageDictionary = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [detectedWord, setDetectedWord] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [translatedWord, setTranslatedWord] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleListen = () => {
        resetTranscript();
        setImageUrl('');
        setTranslatedWord('');
        setDetectedWord('');
        SpeechRecognition.startListening({
            continuous: false,
            language: 'vi-VN'
        }).then(r => console.log("Start listening", r));
    };

    useEffect(() => {
        if (!listening && transcript) {
            setDetectedWord(transcript);
            setLoading(true);
            GenWords(transcript)
                .then(({imageUrl, englishWord}) => {
                    setImageUrl(imageUrl);
                    setTranslatedWord(englishWord);
                    speak(englishWord);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [transcript, listening]);

    if (!hasMounted) return null;
    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div>
            {(detectedWord || translatedWord) && (
                <Typography variant="h3" component="h3" sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    {detectedWord}
                    {translatedWord && (
                        <>
                            <span style={{fontSize: '0.8em', color: '#666'}}>→</span>
                            <span style={{fontSize: '1.2em'}}>{translatedWord}</span>
                            <IconButton
                                onClick={() => speak(translatedWord)}
                                aria-label="speak"
                                sx={{ml: 1, color: 'white', backgroundColor: 'blue'}}
                            >
                                <PlayArrowIcon/>
                            </IconButton>
                        </>
                    )}
                </Typography>
            )}
            {loading && <p>Loading...</p>}
            {!loading && imageUrl && (
                <>
                    <Image
                        src={imageUrl}
                        alt={translatedWord}
                        width={600}
                        height={400}
                        style={{maxWidth: '100%', height: 'auto'}}
                    />
                </>
            )}
            <Button onClick={handleListen} disabled={listening} variant="contained" style={{marginTop: "16px"}}>
                {listening ? 'Listening...' : 'Start Listening'}
            </Button>
        </div>
    );
};

export default ImageDictionary;