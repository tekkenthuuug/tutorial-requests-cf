const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
  snapshotConstructor,
} = require('firebase-functions/lib/providers/firestore');

admin.initializeApp();

const firestore = admin.firestore;

// auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate(user => {
  const { email } = user;
  return firestore().collection('users').doc(user.uid).set({
    email,
    upvotedOn: [],
  });
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
  return firestore().collection('users').doc(user.uid).delete();
});

// Callable function for adding tutorial request
exports.addRequest = functions.https.onCall((data, context) => {
  const { auth } = context;
  const { text } = data;

  if (!auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated users are allowed to submit requests'
    );
  }

  if (text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Request must be no more then 30 characters long'
    );
  }

  firestore()
    .collection('requests')
    .add({
      text,
      upvotes: 0,
    })
    .then(async ref => {
      const snapshot = await ref.get();
      return snapshot.data();
    })
    .catch(err => {
      throw new functions.https.HttpsError('internal', err.message);
    });
});

// upvote callable function
exports.upvote = functions.https.onCall(async (data, context) => {
  const { auth } = context;

  if (!auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated users are allowed to submit requests'
    );
  }

  const userRef = firestore().collection('users').doc(auth.uid);

  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();

  if (userData.upvotedOn.includes(data.id)) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'You are allowed upvote request only once'
    );
  }

  await userRef.update({ upvotedOn: [...userData.upvotedOn, data.id] });

  const requestRef = firestore().collection('requests').doc(data.id);

  return await requestRef.update({
    upvotes: firestore.FieldValue.increment(1),
  });
});
