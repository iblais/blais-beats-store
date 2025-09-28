// Firebase Beats Management System
// Handles uploading beats, managing catalog, and processing orders

class FirebaseBeatStore {
    constructor() {
        this.beatCatalog = [];
    }

    // Upload beat files to Firebase Storage
    async uploadBeatFiles(beatData, files) {
        console.log('🔄 Uploading beat files to Firebase Storage...');

        const uploadPromises = [];
        const fileUrls = {};

        // Generate beat ID if not provided
        if (!beatData.id) {
            beatData.id = this.generateBeatId(beatData.title || 'untitled-beat');
        }

        // Upload each file type
        for (const [fileType, file] of Object.entries(files)) {
            if (file) {
                console.log(`Uploading ${fileType}: ${file.name}`);

                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`beats/${beatData.id}/${fileType}/${file.name}`);

                uploadPromises.push(
                    fileRef.put(file).then(async (snapshot) => {
                        const downloadUrl = await snapshot.ref.getDownloadURL();
                        fileUrls[fileType + '_url'] = downloadUrl;
                        console.log(`✅ Uploaded ${fileType}: ${file.name}`);
                        return downloadUrl;
                    }).catch(error => {
                        console.error(`❌ Error uploading ${fileType}:`, error);
                        throw error;
                    })
                );
            }
        }

        try {
            await Promise.all(uploadPromises);
            console.log('✅ All files uploaded successfully');
            return fileUrls;
        } catch (error) {
            console.error('❌ Upload failed:', error);
            throw error;
        }
    }

    // Add beat to Firestore database
    async addBeat(beatData, fileUrls) {
        try {
            const beat = {
                ...beatData,
                ...fileUrls,
                createdAt: firebase.firestore.Timestamp.now(),
                status: 'active',
                downloads: 0,
                tags: beatData.tags || []
            };

            console.log('Adding beat to Firestore:', beat);

            const docRef = await firebase.firestore()
                .collection('beats')
                .add(beat);

            console.log('✅ Beat added to database:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error adding beat:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all beats from database
    async loadBeats() {
        try {
            const snapshot = await firebase.firestore()
                .collection('beats')
                .where('status', '==', 'active')
                .orderBy('createdAt', 'desc')
                .get();

            this.beatCatalog = [];
            snapshot.forEach(doc => {
                this.beatCatalog.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log(`✅ Loaded ${this.beatCatalog.length} beats from database`);
            return this.beatCatalog;
        } catch (error) {
            console.error('❌ Error loading beats:', error);
            return [];
        }
    }

    // Process order and create download package
    async processOrder(cartItems, customerInfo, paymentInfo) {
        try {
            const order = {
                items: cartItems,
                customer: customerInfo,
                payment: paymentInfo,
                total: cartItems.reduce((sum, item) => sum + item.price, 0),
                status: 'completed',
                createdAt: new Date(),
                downloadExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            };

            const docRef = await window.firebase.firestore()
                .collection('orders')
                .add(order);

            // Generate download links
            const downloadLinks = await this.generateDownloadLinks(cartItems, docRef.id);

            console.log('✅ Order processed:', docRef.id);
            return {
                success: true,
                orderId: docRef.id,
                downloadLinks
            };
        } catch (error) {
            console.error('❌ Error processing order:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate download links for purchased beats
    async generateDownloadLinks(cartItems, orderId) {
        const links = {};

        for (const item of cartItems) {
            links[item.id] = {
                wav: item.wavUrl,
                mp3: item.mp3Url,
                stems: item.stemsUrl,
                artwork: item.artworkUrl,
                license: this.generateLicenseAgreement(item, orderId)
            };
        }

        return links;
    }

    // Generate license agreement
    generateLicenseAgreement(beat, orderId) {
        return {
            type: 'Basic License',
            orderId: orderId,
            beatTitle: beat.title,
            purchaseDate: new Date().toISOString(),
            terms: [
                'Non-exclusive license for music production',
                'Commercial use allowed up to 100,000 copies',
                'Credit required: "Produced by BLAIS"',
                'No resale of beat allowed'
            ]
        };
    }

    // Bulk upload from Dropbox folder structure
    async importFromDropbox(folderStructure) {
        console.log('🔄 Importing beats from Dropbox structure...');

        const imported = [];

        for (const [beatName, files] of Object.entries(folderStructure)) {
            try {
                // Extract metadata from filename
                const metadata = this.extractMetadata(beatName);

                const beatData = {
                    id: this.generateBeatId(beatName),
                    title: metadata.title || beatName,
                    bpm: metadata.bpm || 140,
                    key: metadata.key || 'C Minor',
                    genre: metadata.genre || 'Hip Hop',
                    price: 39.99,
                    description: `${metadata.title || beatName} - ${metadata.bpm || 140} BPM ${metadata.key || 'C Minor'} ${metadata.genre || 'Hip Hop'} beat produced by BLAIS`,
                    tags: [metadata.genre || 'Hip Hop', 'BLAIS', 'Beat']
                };

                // Convert Dropbox URLs to Firebase Storage
                const fileUrls = await this.convertDropboxToFirebase(files);

                const result = await this.addBeat(beatData, fileUrls);

                if (result.success) {
                    imported.push(beatData.title);
                }
            } catch (error) {
                console.error(`❌ Error importing ${beatName}:`, error);
            }
        }

        console.log(`✅ Successfully imported ${imported.length} beats`);
        return imported;
    }

    // Convert Dropbox URLs to Firebase Storage
    async convertDropboxToFirebase(dropboxFiles) {
        // This would download from Dropbox and re-upload to Firebase
        // For now, we'll return the Dropbox URLs
        return {
            wavUrl: dropboxFiles.wav,
            mp3Url: dropboxFiles.mp3,
            stemsUrl: dropboxFiles.stems,
            artworkUrl: dropboxFiles.artwork
        };
    }

    // Extract metadata from filename
    extractMetadata(filename) {
        const bpmMatch = filename.match(/(\d{2,3})\s*bpm/i);
        const keyMatch = filename.match(/([A-G][#b]?\s*(major|minor|maj|min))/i);

        let genre = 'Hip Hop';
        if (filename.toLowerCase().includes('trap')) genre = 'Trap';
        if (filename.toLowerCase().includes('boom')) genre = 'Boom Bap';
        if (filename.toLowerCase().includes('r&b')) genre = 'R&B';

        return {
            title: filename.replace(/[-_]/g, ' '),
            bpm: bpmMatch ? parseInt(bpmMatch[1]) : null,
            key: keyMatch ? keyMatch[1] : null,
            genre: genre
        };
    }

    generateBeatId(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

// Export for use
window.FirebaseBeatStore = FirebaseBeatStore;