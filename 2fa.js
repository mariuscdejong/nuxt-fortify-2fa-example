export default function ({ $auth, redirect }) {
  if (!$auth.$storage.getUniversal('challengeCompleted')) {
    return redirect('/two-factor-authentication');
  }
}
