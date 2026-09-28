// Membros da equipe Vivens
export const TEAM_MEMBERS = [
  { id: 'jivago', name: 'Jivago Rolo', email: 'jivago@vivenslab.com', role: 'Sócio-Diretor' },
  { id: 'bruno', name: 'Bruno Braga', email: 'bruno@vivenslab.com', role: 'Sócio-Diretor' },
  { id: 'luisa', name: 'Luisa Braga', email: 'luisa@vivenslab.com', role: 'Consultora' },
  { id: 'marta', name: 'Marta Speck', email: 'marta@vivenslab.com', role: 'Consultora' },
] as const;

export type TeamMemberId = typeof TEAM_MEMBERS[number]['id'];

export function getTeamMemberName(id: string): string {
  return TEAM_MEMBERS.find(m => m.id === id)?.name ?? id;
}

export function getTeamMemberByEmail(email: string): typeof TEAM_MEMBERS[number] | undefined {
  return TEAM_MEMBERS.find(m => m.email === email);
}
