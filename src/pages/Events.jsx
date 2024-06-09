import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, VStack, Text, Box, Spinner } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { useEvents } from "../integrations/supabase/index.js";

const Events = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { data: events, isLoading, error } = useEvents();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent>
        <Text>Error loading events: {error.message}</Text>
      </Container>
    );
  }

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Events</Heading>
        {events.length === 0 ? (
          <Text>No events available.</Text>
        ) : (
          events.map(event => (
            <Box key={event.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
              <Heading as="h2" size="md">{event.name}</Heading>
              <Text>Date: {new Date(event.date).toLocaleDateString()}</Text>
              <Text>Venue ID: {event.venue_id}</Text>
              <Text>Starred: {event.is_starred ? "Yes" : "No"}</Text>
              <Text>Private: {event.private ? "Yes" : "No"}</Text>
              <Text>Cancelled: {event.cancelled ? "Yes" : "No"}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Events;