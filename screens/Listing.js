import React, {useState, useEffect} from 'react';
import { useStateValue } from "../components/State";
import {View, Text, StyleSheet, Button, Platform, ActivityIndicator, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Link } from "../components/Link";
import { RichText } from "../components/RichText";
import { getStyles, Theme, getContent } from '../utils';
import Map from "../components/Map";
import { FontAwesome } from '@expo/vector-icons';
import Attribution from "../components/Attribution";
import { WebView } from 'react-native-webview';

function Page(props) {

    const [{ view, isWeb, dimensions }, dispatch] = useStateValue();
    const styles = StyleSheet.create(getStyles('text_header2, text_body, text_body2, section, content, text_link', {isWeb}));

    const [ pageLoading, setPageLoading ] = useState(!props.content);
    const [ content, setContent ] = useState(props.content);
    const [ galleryOpen, setGalleryOpen ] = useState(false);

    if (!props.content) {
        useEffect(() => {
            getContent({
                type: 'listing',
                uid: view.split('/')[2]
            }).then(_data => {
                setContent(_data.content)
                setPageLoading(false);
            }).catch(err => {
                console.error(err);
            });
        }, [])
    }

    function clickImage(index) {
        dispatch({type: 'lightboxConfig', value: {
            index: index || 0,
            images: content.images.filter(image => image.image).map(image => image.image)
        }})
        dispatch({type: 'lightbox', value: true})
    }

    let primaryImages = content ? content.images.filter(_image => _image.image).map(_image => {
        let image = _image.image;
        //console.log('image', image)
        image.ratio = image.height / image.width;
        let ratioScore = Math.round(Math.abs(0.56 - image.ratio) * 1.3);
        image.imageScore = ratioScore
        return image
    }).sort((a, b) => {
        return a.imageScore - b.imageScore
    }) : []
    /*primaryImages.forEach((image, i) => {
        console.log('i', i, 'score', image.imageScore, 'ratio', image.ratio, 'widthxh', image.width, image.height)
    })*/

    return (
        <ScrollView>
        { pageLoading ?
            <View style={{marginTop: 200, marginBottom: 200}}>
                <ActivityIndicator size="large" />
            </View>
        : (
            <React.Fragment>
                <View style={{paddingTop: isWeb ? 120 : 0 }} />
                <View style={{flexDirection: 'row', backgroundColor: Theme.green_bg}}>
                    <View style={{flex: 2, borderRightWidth: 2, borderColor: '#fff'}}>
                        <TouchableOpacity onPress={e => clickImage(0)}>
                            <Image source={{uri: primaryImages[0].url + '&w=1200'}} style={{width: '100%', height: dimensions.width < 600 ? 302 : dimensions.width < 900 ? 402 : 602}} resizeMode="cover" />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, borderBottomWidth: 2, borderColor: '#fff'}}>
                            <TouchableOpacity onPress={e => clickImage(1)}>
                                <Image source={{uri: primaryImages[1].url + '&w=600'}} style={{width: '100%', height: dimensions.width < 600 ? 150 : dimensions.width < 900 ? 200 : 300}} resizeMode="cover" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={e => clickImage(2)}>
                                <Image source={{uri: primaryImages[2].url + '&w=600'}} style={{width: '100%', height: dimensions.width < 600 ? 150 : dimensions.width < 900 ? 200 : 300}} resizeMode="cover" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[dimensions.width < 600 ? {} : {flexDirection: 'row'}, {backgroundColor: Theme.green_bg, borderTopWidth: 2, borderColor: '#fff'}]}>
                    <View style={[dimensions.width < 600 ? {} : {flex:2}, {borderRightWidth: 2, borderColor: '#fff', alignItems: 'flex-end'}]}>
                        <View style={{padding: 20, paddingTop: 40, paddingBottom: dimensions.width < 600 ? 0 : 40, width: 795, maxWidth: '100%', marginLeft: 10}}>
                            <Text style={[styles.text_header2, {color: '#fff', textTransform: 'none', paddingBottom: 20}]}>{content.name}</Text>
                            {content.address && 
                                <Link href={`https://www.google.com/maps/dir//${content.address.join(' ').split(/\s/g).join('+')}`} target="_blank">
                                    <Text style={[styles.text_body, {color: '#fff', paddingBottom:20}]}>{content.address}</Text>
                                </Link>
                            }
                            {content.hours && content.hours.length &&
                                content.hours.map((line, l) => (
                                    <Text key={'hoursline' + l} style={[styles.text_body, {color: '#fff', fontSize: 18}]}>{line}</Text>
                                ))
                            }
                        </View>
                    </View>
                    <View style={[dimensions.width < 600 ? {} : {flex:1}, {alignItems: 'flex-start', justifyContent: 'center'}]}>
                        <View style={{padding: 20}}>
                            {content.phone_number &&
                                <Link href={'tel:' + content.phone_number}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                                        <View style={{marginRight: 10}}>
                                            <FontAwesome name="phone" size={24} color="#fff" />
                                        </View>
                                        <View>
                                            <Text style={[styles.text_body, {color: '#fff', fontSize: 18}]}>{content.phone_number}</Text>
                                        </View>
                                    </View>
                                </Link>
                            }
                            {content.instagram &&
                                <Link href={'https://instagram.com/' + (content.instagram.indexOf('@') > -1 ? content.instagram.slice(1) : content.instagram)}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10}}>
                                        <View style={{marginRight: 10}}>
                                            <FontAwesome name="instagram" size={24} color="#fff" />
                                        </View>
                                        <View>
                                            <Text style={[styles.text_body, {color: '#fff', fontSize: 18}]}>{content.instagram.substr(1)}</Text>
                                        </View>
                                    </View>
                                </Link>
                            }
                            {content.website_url &&
                                <Link href={content.website_url}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10}}>
                                        <View style={{marginRight: 10}}>
                                            <FontAwesome name="link" size={24} color="#fff" />
                                        </View>
                                        <View>
                                            <Text style={[styles.text_body, {color: '#fff', fontSize: 18}]}>{content.website_url
                                                .replace(
                                                    "https://",
                                                    ""
                                                )
                                                .replace(
                                                    "http://",
                                                    ""
                                                )
                                                .replace(
                                                    "www.",
                                                    ""
                                                ).split('/')[0]}</Text>
                                        </View>
                                    </View>
                                </Link>
                            }
                            {content.online_ordering_link &&
                                <Link href={content.online_ordering_link}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10}}>
                                        <View style={{marginRight: 10}}>
                                            <FontAwesome name="link" size={24} color="#fff" />
                                        </View>
                                        <View>
                                            <Text style={[styles.text_body, {color: '#fff', fontSize: 18}]}>Online Ordering</Text>
                                        </View>
                                    </View>
                                </Link>
                            }
                            {content.cuisines && content.cuisines.length && <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10}}>
                                <View style={{marginRight: 10}}>
                                    <FontAwesome name="tags" size={24} color="#fff" />
                                </View>
                                <View>
                                    <Text style={[styles.text_body, {color: '#fff', fontSize: 18}]}>
                                        {content.cuisines.map(cuisine => cuisine.cuisine).filter(cuisine => cuisine).join(', ')}
                                    </Text>
                                </View>
                            </View>}
                        </View>
                    </View>
                </View>
                {content.youtube_video && <View style={[styles.section, {paddingBottom: 0}]}>
                    <View style={[styles.content, isWeb ? {} : {height: 300}]}>
                        {isWeb ? (
                            <div
                            dangerouslySetInnerHTML={{
                              __html: content.youtube_video.html}} />
                        ) : (
                            <WebView
                                    style={ styles.WebViewContainer }
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    source={{uri: 'https://www.youtube.com/embed/' + (content.youtube_video.embed_url.split(/youtu.be\/|youtube.com\//)[1] || '') }}
                            />
                        )}
                    </View>
                </View>}
                <View style={[styles.section]}>
                    <View style={[styles.content]}>
                        <RichText render={content._bio} isWeb={isWeb} />
                        {!!(content.attribution && content.attribution.length) && <Attribution attribution={content.attribution} />}
                    </View>
                </View>
            </React.Fragment>
        )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Page;