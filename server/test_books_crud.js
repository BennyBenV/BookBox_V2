const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token;
let createdBookId;

const testUser = {
    username: 'testuser_books',
    email: `test_books_${Date.now()}@example.com`,
    password: 'password123'
};

const testBook = {
    title: 'Test Book',
    authors: ['Test Author'],
    description: 'A book for testing',
    readingStatus: 'TO_READ',
    rating: 4
};

async function runTests() {
    console.log('--- Starting Book API Tests ---');

    try {
        // 1. Register/Login
        console.log('\n1. Authenticating...');
        try {
            const authRes = await axios.post(`${API_URL}/auth/register`, testUser);
            token = authRes.data.token;
            console.log('✅ Registered new user');
        } catch (e) {
            // If user exists, try login
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: testUser.email, password: testUser.password });
            token = loginRes.data.token;
            console.log('✅ Logged in existing user');
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Create Book
        console.log('\n2. Creating Book...');
        const createRes = await axios.post(`${API_URL}/books`, testBook, config);
        createdBookId = createRes.data._id;
        console.log(`✅ Book created with ID: ${createdBookId}`);
        if (createRes.data.title !== testBook.title) throw new Error('Title mismatch');

        // 3. Get All Books
        console.log('\n3. Fetching User Books...');
        const listRes = await axios.get(`${API_URL}/books`, config);
        console.log(`✅ Fetched ${listRes.data.length} books`);
        const found = listRes.data.find(b => b._id === createdBookId);
        if (!found) throw new Error('Created book not found in list');

        // 4. Get Single Book
        console.log('\n4. Fetching Single Book...');
        const detailRes = await axios.get(`${API_URL}/books/${createdBookId}`, config);
        console.log(`✅ Fetched details for: ${detailRes.data.title}`);

        // 5. Update Book
        console.log('\n5. Updating Book...');
        const updateRes = await axios.put(`${API_URL}/books/${createdBookId}`, {
            readingStatus: 'READING',
            personalReview: 'Great read so far!'
        }, config);
        console.log(`✅ Updated status to: ${updateRes.data.readingStatus}`);
        if (updateRes.data.readingStatus !== 'READING') throw new Error('Status update failed');

        // 6. Delete Book
        console.log('\n6. Deleting Book...');
        await axios.delete(`${API_URL}/books/${createdBookId}`, config);
        console.log('✅ Book deleted');

        // Verify Deletion
        try {
            await axios.get(`${API_URL}/books/${createdBookId}`, config);
            throw new Error('Book should be 404 after delete');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ Verification: Book not found (404) as expected');
            } else {
                throw error;
            }
        }

        console.log('\n🎉 ALL TESTS PASSED!');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runTests();
