const app = new Vue({
  el: '#app',
  data: {
    requests: [],
  },
  methods: {
    async handleUpvote(id) {
      const upvote = firebase.functions().httpsCallable('upvote');

      try {
        await upvote({ id });
      } catch (error) {
        showNotification(error.message);
      }
    },
  },
  mounted() {
    const ref = firebase
      .firestore()
      .collection('requests')
      .orderBy('upvotes', 'desc');

    ref.onSnapshot(snapshot => {
      const requests = snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      this.requests = requests;
    });
  },
});
