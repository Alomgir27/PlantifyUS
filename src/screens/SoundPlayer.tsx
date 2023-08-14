import * as React from 'react';
import { Button, Block, Text } from '../components';
import { Audio } from 'expo-av';
import { useTheme } from '../hooks';

import * as ICONS from '@expo/vector-icons';

function SoundPlayer({ uri }) {

    const [sound, setSound] = React.useState();
    const [isPlaying, setIsPlaying] = React.useState(false); 
    
    const { sizes, colors } = useTheme();

   
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
        );
        setSound(sound);
        setIsPlaying(true);
    }



    async function pauseSound() {
        await sound.pauseAsync();
        setIsPlaying(false);
    }


    React.useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

   const onPlaybackStatusUpdate = (status) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.log(`Encountered a fatal error during playback: ${status.error}`);
            }
        } else {
            if (status.didJustFinish) {
                setIsPlaying(false);
            }
        }
    }

       

    return (
        <Block card row primary width={250} justify="space-around">
            <Button onPress={isPlaying ? pauseSound : playSound}  align="center" row marginBottom={sizes.sm} justify="space-between">
                <ICONS.Ionicons name='mic' size={20} color={isPlaying ? colors.secondary : colors.gray} style={{ marginBottom: sizes.sm / 2 }} />
                <ICONS.Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={isPlaying ? colors.danger : colors.gray} style={{ marginBottom: sizes.sm / 2 }} />
            </Button>
            <Text gray marginTop={sizes.sm / 2}>{isPlaying ? 'Recording' : 'Play'}</Text>
        </Block>
    );
}

export default SoundPlayer;
