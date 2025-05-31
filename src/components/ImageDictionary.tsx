"use client";

import React, {useEffect, useState} from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import Image from "next/image";
import {Button, CircularProgress, IconButton, Typography} from "@mui/material";
import {GoogleEnglishWord, GoogleGenImage} from "@/tools/GoogleGenImage";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
};

const ImageDictionary = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [detectedWord, setDetectedWord] = useState("");
    const [translatedWord, setTranslatedWord] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => setHasMounted(true), []);

    useEffect(() => {
        if (!listening && transcript) {
            processTranscript(transcript).then(r => console.log("processed", r));
        }
    }, [transcript, listening]);

    const processTranscript = async (word: string) => {
        try {
            setDetectedWord(word);
            setLoading(true);
            const englishWord = await GoogleEnglishWord(word);
            setTranslatedWord(englishWord);
            speak(englishWord);
            const image = await GoogleGenImage(englishWord);
            setImageUrl(image);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleListen = () => {
        resetTranscript();
        setDetectedWord("");
        setTranslatedWord("");
        setImageUrl("");
        SpeechRecognition.startListening({continuous: false, language: "vi-VN"}).then(r => console.log(r));
    };

    if (!hasMounted) return null;
    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {(detectedWord || translatedWord) && (
                <Typography variant="h3" component="h3" sx={{display: "flex", alignItems: "center", gap: 2}}>
                    {detectedWord}
                    {translatedWord && (
                        <>
                            <span style={{fontSize: "0.8em", color: "#666"}}>→</span>
                            <span style={{fontSize: "1.2em"}}>{translatedWord}</span>
                            <IconButton
                                onClick={() => speak(translatedWord)}
                                aria-label="speak"
                                sx={{ml: 1, color: "white", backgroundColor: "blue"}}
                            >
                                <PlayArrowOutlinedIcon/>
                            </IconButton>
                        </>
                    )}
                </Typography>
            )}
            {loading ? (
                <CircularProgress/>
            ) : (
                imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={translatedWord}
                        width={512}
                        height={512}
                        style={{maxWidth: "100%", height: "auto"}}
                    />
                )
            )}
            <Button
                onClick={handleListen}
                disabled={listening}
                variant="contained"
                sx={{mt: 2}}
            >
                {listening ? "Listening..." : "Start Listening"}
            </Button>
        </div>
    );
};

export default ImageDictionary;