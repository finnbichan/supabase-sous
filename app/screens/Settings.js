import { supabase } from '../../supabase';
import { View, Text, Pressable, SafeAreaView, Modal, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import useStyles from '../styles/Common';
import FloatingDrawerButton from '../components/FloatingDrawerButton';
import AppButton from '../components/AppButton';
import AppHeaderText from '../components/AppHeaderText';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../Contexts';

const Settings = () => {
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [invites, setInvites] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(false);
    const { colours } = useTheme();
    const styles = useStyles();
    const session = useContext(AuthContext);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const fetchInvites = async () => {
        setLoadingInvites(true);
        try {
            const { data, error } = await supabase.rpc('get_invites');
            console.log('Fetched invites:', data);
            if (error) {
                console.error('Error fetching invites:', error);
            } else {
                setInvites(data || []);
            }
        } catch (err) {
            console.error('Unexpected error fetching invites:', err);
        }
        setLoadingInvites(false);
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleAcceptInvite = async (inviteId) => {
        try {
            const { error } = await supabase.rpc('accept_invite', {
                p_invite_id: inviteId
            });
            if (error) {
                console.error('Error accepting invite:', error);
            } else {
                await fetchInvites();
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    const handleRejectInvite = async (inviteId) => {
        try {
            const { error } = await supabase.rpc('reject_invite', {
                p_invite_id: inviteId
            });
            if (error) {
                console.error('Error rejecting invite:', error);
            } else {
                await fetchInvites();
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    const handleRemoveSharing = async (userId) => {
        try {
            const { error } = await supabase.rpc('remove_sharing', {
                p_user_id: userId
            });
            if (error) {
                console.error('Error removing sharing:', error);
            } else {
                await fetchInvites();
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    const handleInvitePress = async () => {
        setEmailError('');
        if (!inviteEmail.trim()) {
            setEmailError('Please enter an email address');
            return;
        }
        if (!validateEmail(inviteEmail)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        
        try {
            const { data, error } = await supabase.rpc('invite_user_by_email', {
                p_email: inviteEmail
            });
            
            if (error) {
                console.error('Error inviting user:', error);
                setEmailError(error.message || 'Failed to send invite');
                return;
            }
            
            console.log('User invited successfully:', data);
            setInviteEmail('');
            setInviteModalOpen(false);
        } catch (err) {
            console.error('Unexpected error:', err);
            setEmailError('An unexpected error occurred');
        }
    };

    const handleCloseInviteModal = () => {
        setInviteEmail('');
        setEmailError('');
        setInviteModalOpen(false);
    };

    function logOut() {
        supabase.auth.signOut();
    }

    const settingsStyles = StyleSheet.create({
        section: {
            marginBottom: 24,
            width: '100%'
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colours.text,
            marginBottom: 12,
            marginLeft: 16,
            marginTop: 8
        },
        buttonContainer: {
            marginHorizontal: 8,
            marginVertical: 8
        },
        sharingButton: {
            backgroundColor: colours.card,
            borderColor: colours.text,
            borderWidth: 1,
            marginHorizontal: 8,
            borderRadius: 4,
            paddingVertical: 12,
            paddingHorizontal: 8
        },
        sharingButtonDisabled: {
            backgroundColor: colours.card,
            borderColor: '#999',
            borderWidth: 1,
            marginHorizontal: 8,
            borderRadius: 4,
            paddingVertical: 12,
            paddingHorizontal: 8,
            opacity: 0.6
        },
        sharingButtonText: {
            color: colours.text,
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center'
        },
        sharingButtonTextDisabled: {
            color: '#999',
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center'
        },
        inviteCard: {
            backgroundColor: colours.card,
            borderRadius: 4,
            padding: 12,
            marginHorizontal: 8,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: colours.text
        },
        inviteMessage: {
            color: colours.text,
            fontSize: 14,
            marginBottom: 10,
            fontWeight: '500'
        },
        inviteButtonRow: {
            flexDirection: 'row',
            gap: 8
        },
        smallButton: {
            flex: 1,
            backgroundColor: colours.card,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: colours.text,
            paddingVertical: 8,
            paddingHorizontal: 8
        },
        smallButtonText: {
            color: colours.text,
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center'
        }
    });

    const modalStyles = StyleSheet.create({
        overlay: {
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        },
        modal: {
            backgroundColor: colours.background,
            padding: 20,
            width: '90%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: '150',
            position: 'absolute',
            borderRadius: 8,
            flexGrow: 0
        },
        emailInput: {
            backgroundColor: colours.card,
            borderRadius: 4,
            padding: 12,
            width: '100%',
            color: colours.text,
            margin: 10,
            fontSize: 16,
            marginBottom: emailError ? 4 : 10
        },
        errorText: {
            color: '#ef4444',
            fontSize: 14,
            marginBottom: 10,
            alignSelf: 'flex-start',
            marginLeft: 10
        },
        buttonRow: {
            flexDirection: 'row',
            gap: 10,
            width: '100%',
            marginTop: 10
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <AppHeaderText>Settings</AppHeaderText>
            <FloatingDrawerButton />
            <ScrollView contentContainerStyle={{ paddingVertical: 20, alignItems: 'center' }}>
                {/* Sharing Settings Section */}
                <View style={settingsStyles.section}>
                    <Text style={settingsStyles.sectionTitle}>Sharing</Text>
                    
                    {loadingInvites ? (
                        <ActivityIndicator size="large" color={colours.text} style={{ marginVertical: 20 }} />
                    ) : (
                        <>
                            {/* Pending Invites */}
                            {invites.filter(inv => inv.status === 0).map((invite) => (
                                <View key={invite.invite_id} style={settingsStyles.inviteCard}>
                                    <Text style={settingsStyles.inviteMessage}>
                                        {invite.sender_name} has invited you to their list
                                    </Text>
                                    <View style={settingsStyles.inviteButtonRow}>
                                        <Pressable
                                            style={[settingsStyles.smallButton, { borderColor: '#4CAF50' }]}
                                            onPress={() => handleAcceptInvite(invite.id)}
                                        >
                                            <Text style={[settingsStyles.smallButtonText, { color: '#4CAF50' }]}>Accept</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[settingsStyles.smallButton, { borderColor: '#EF4444' }]}
                                            onPress={() => handleRejectInvite(invite.id)}
                                        >
                                            <Text style={[settingsStyles.smallButtonText, { color: '#EF4444' }]}>Reject</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                            
                            {/* Accepted Invites */}
                            {invites.filter(inv => inv.status === 1).map((invite) => (
                                <View key={invite.invite_id} style={settingsStyles.inviteCard}>
                                    <Text style={settingsStyles.inviteMessage}>
                                        You are sharing with {invite.sender_name}
                                    </Text>
                                    <Pressable
                                        style={[settingsStyles.smallButton, { borderColor: '#EF4444' }]}
                                        onPress={() => handleRemoveSharing(invite.invited_by_user_id)}
                                    >
                                        <Text style={[settingsStyles.smallButtonText, { color: '#EF4444' }]}>Remove</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </>
                    )}
                    
                    <Pressable
                        onPress={() => setInviteModalOpen(true)}
                        disabled={invites.some(inv => inv.status === 'accepted')}
                        style={invites.some(inv => inv.status === 'accepted') ? settingsStyles.sharingButtonDisabled : settingsStyles.sharingButton}
                    >
                        <Text style={invites.some(inv => inv.status === 'accepted') ? settingsStyles.sharingButtonTextDisabled : settingsStyles.sharingButtonText}>
                            Invite a user to share
                        </Text>
                    </Pressable>
                </View>
                {/* Account Settings Section */}
                <View style={settingsStyles.section}>
                    <Text style={settingsStyles.sectionTitle}>Account</Text>
                    <View style={settingsStyles.buttonContainer}>
                        <Pressable onPress={logOut} style={styles.logOutButton}>
                            <Text style={styles.buttonText}>Log out</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={inviteModalOpen}
                animationType="none"
                transparent
            >
                <Pressable
                    style={modalStyles.overlay}
                    onPress={handleCloseInviteModal}
                />
                <View style={modalStyles.modal}>
                    <AppHeaderText>Invite a user</AppHeaderText>
                    <TextInput
                        style={modalStyles.emailInput}
                        placeholder="Email address"
                        placeholderTextColor={colours.secondaryText}
                        value={inviteEmail}
                        onChangeText={setInviteEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {emailError ? (
                        <Text style={modalStyles.errorText}>{emailError}</Text>
                    ) : null}
                    <View style={modalStyles.buttonRow}>
                        <View style={{ flex: 1 }}>
                            <AppButton
                                label="Cancel"
                                onPress={handleCloseInviteModal}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppButton
                                label="Invite"
                                onPress={handleInvitePress}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Settings;
