import { FormEvent, useState } from 'react';
import { useAuth } from '../state/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, ErrorText, FormGroup, Heading, Input, Label } from '../components/ui';

export function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(email, displayName, password);
      nav('/');
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container style={{ maxWidth: 480 }}>
      <Card>
        <Heading>Create Account</Heading>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </FormGroup>
          <FormGroup>
            <Label>Display Name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} type="text" required />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} />
          </FormGroup>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
